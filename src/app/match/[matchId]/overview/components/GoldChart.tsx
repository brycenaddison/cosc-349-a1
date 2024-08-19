'use client';

import {
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  Tooltip as ChartTooltip,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
} from 'chart.js';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import colors from 'tailwindcss/colors';
import { useOverview } from './OverviewDashboard';
import { type ViewOption } from './ViewSelector';
import { getStatInfo } from '@/lib/timeline';
import { formatTimestamp } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler,
);

/** Converts stat timestamp to a cartesian point. */
const statTimestampToPoint = ({
  timestamp,
  value,
}: {
  timestamp: number;
  value: number;
}): {
  x: number;
  y: number;
} => ({ x: timestamp, y: value });

/** Gets stat fetcher depending on which stat is selected. */
const statFunctions: Record<
  ViewOption['stat'],
  Parameters<typeof getStatInfo>[2]
> = {
  Gold: (frame) => frame.totalGold,
  Experience: (frame) => frame.xp,
  CS: (frame) => frame.jungleMinionsKilled + frame.minionsKilled,
  Damage: (frame) => frame.damageStats.totalDamageDoneToChampions,
  Kills: (frame) => frame.kills,
};

/**
 * A stat chart that emulates one from the League of Legends client.
 */
export const GoldChart = (): JSX.Element => {
  const {
    timeline,
    players,
    view: { stat, graph },
    selectedPlayers,
    hoveredPlayer,
    minute,
    setMinute,
  } = useOverview();

  const { resolvedTheme: theme = 'light' } = useTheme();
  const isDark = theme === 'dark';

  const tickColor = colors.gray[isDark ? 800 : 200];
  const red = colors.red[500];
  const blue = colors.blue[500];
  const xInterval = 120000;

  const {
    participants,
    red: redTeam,
    blue: blueTeam,
    difference,
  } = useMemo(
    () =>
      getStatInfo(
        players,
        timeline,
        graph === 'Champion Total' && stat === 'Kills'
          ? (frame) => frame.kills + frame.assists
          : statFunctions[stat],
      ),
    [players, timeline, graph, stat],
  );

  const options: ChartOptions<'line'> = {
    responsive: true,
    parsing: false,
    maintainAspectRatio: false,
    onClick: (event, _, chart) => {
      if (event.x === null || event.y === null) return;

      const ms = chart.scales.x.getValueForPixel(event.x);

      if (ms === undefined) return;

      const newMinute = Math.round(ms / 60000);

      if (minute === newMinute) {
        setMinute(undefined);
      } else {
        setMinute(newMinute);
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      filler: {
        propagate: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const { x: ms, y: value } = context.parsed;
            const name = context.dataset.label;

            return `${graph === 'Champion Total' ? `${name}: ` : ''}${value.toLocaleString()} at ${formatTimestamp(ms)}`;
          },
          title: () => '',
        },
        displayColors: graph !== 'Team Advantage',
      },
    },
    scales: {
      x: {
        type: 'linear',
        grid: {
          display: false,
        },
        ticks: {
          callback: (value) => formatTimestamp(value as number),
          stepSize: xInterval,
        },
        afterBuildTicks: ({ ticks }) => {
          ticks.pop();
          ticks.push({ value: ticks[ticks.length - 1].value + xInterval });
        },
        max: difference[difference.length - 1].timestamp,
      },
      y: {
        type: 'linear',
        grid: {
          color: tickColor,
          tickColor,
          lineWidth: ({ tick }) => (tick.value === 0 ? 3 : 1),
        },
        border: {
          display: false,
        },
        ticks: {
          callback: (value, _, ticks) =>
            ticks.some(({ value }) => value !== 0 && Math.abs(value) < 1000)
              ? value
              : value === 0
                ? '0'
                : `${(value as number) / 1000}k`,
        },
      },
    },
  };

  const data: ChartData<'line'> = useMemo(() => {
    switch (graph) {
      case 'Team Total':
        return {
          datasets: [
            {
              label: 'Blue Team',
              data: blueTeam.map(statTimestampToPoint),
              borderColor: blue,
              backgroundColor: blue,
              showLine: true,
              pointRadius: 0,
              borderWidth: 2,
            },
            {
              label: 'Red Team',
              data: redTeam.map(statTimestampToPoint),
              borderColor: red,
              backgroundColor: red,
              showLine: true,
              pointRadius: 0,
              borderWidth: 2,
            },
          ],
        };
      case 'Team Advantage':
        return {
          datasets: [
            {
              label: 'Team Gold Advantage',
              data: difference.map(statTimestampToPoint),
              showLine: true,
              fill: {
                above: blue,
                below: red,
                target: { value: 0 },
              },
              borderWidth: 0,
              pointRadius: 0,
            },
          ],
        };
      case 'Champion Total':
        return {
          datasets: Object.values(participants).map(
            ({
              participant: { displayName, participantId, teamId },
              timestamps,
            }) => {
              const color = `${teamId === 100 ? blue : red}${hoveredPlayer !== undefined && hoveredPlayer !== participantId ? '0a' : 'FF'}`;

              return {
                label: displayName,
                data: timestamps.map(statTimestampToPoint),
                borderColor: color,
                backgroundColor: color,
                showLine: true,
                pointRadius: 0,
                borderWidth: 2,
                hidden:
                  selectedPlayers.length !== 0 &&
                  hoveredPlayer !== participantId &&
                  !selectedPlayers.includes(participantId),
              };
            },
          ),
        };
    }
  }, [
    blue,
    blueTeam,
    difference,
    graph,
    hoveredPlayer,
    participants,
    red,
    redTeam,
    selectedPlayers,
  ]);

  return (
    <div className='flex flex-col mt-2 grow px-4 gap-2 overflow-hidden'>
      <div className='relative grow'>
        <div className='absolute bottom-0 left-0 right-0 top-0'>
          <Line options={options} data={data} />
        </div>
      </div>
    </div>
  );
};
