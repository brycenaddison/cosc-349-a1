'use client';
import {
  CategoryScale,
  Chart as ChartJS,
  Tooltip as ChartTooltip,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import colors from 'tailwindcss/colors';
import { Tooltip } from '@/components/ui/Tooltip';

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

export const ScoreTooltip = ({
  children,
  score,
}: {
  children: JSX.Element;
  score: { x: number; y: number }[];
}): JSX.Element => {
  return (
    <Tooltip
      tooltip={
        <Line
          options={{
            parsing: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                type: 'linear',
                max: score[score.length - 1].x,
                min: 0,
              },
              y: {
                suggestedMin: 0,
                suggestedMax: 100,
              },
            },
          }}
          data={{
            datasets: [
              {
                label: 'Score',
                data: score,
                borderColor: colors.blue[500],
                backgroundColor: colors.blue[500],
                showLine: true,
                pointRadius: 0,
                borderWidth: 2,
              },
            ],
          }}
        />
      }
    >
      {children}
    </Tooltip>
  );
};
