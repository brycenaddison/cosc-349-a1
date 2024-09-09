'use client';

import {
  BarElement,
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Cog } from 'lucide-react';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import colors from 'tailwindcss/colors';
import {
  DataSelector,
  defaultDatasets,
} from '@/app/match/[matchId]/graphs/components/DataSelector';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet';
import { type Participants } from '@/lib/match';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

/** Props for {@link BarChart}. */
export type BarChartProps = {
  /** The Riot API match data. */
  match: Riot.MatchV5.Match;
  /** The players in the match. */
  players: Participants;
};

/** A data chart emulating the one in the League of Legends client. */
export const BarChart = ({ match, players }: BarChartProps): JSX.Element => {
  const [datasets, setDatasets] =
    useState<
      { name: string; value: (p: Riot.MatchV5.Participant) => number }[]
    >(defaultDatasets);

  const getColor = ({ dataIndex }: { dataIndex: number }): string => {
    const team = Object.values(players)[dataIndex].teamId;
    return team === 100 ? colors.blue[500] : colors.red[500];
  };

  const data: ChartData<'bar'> = {
    labels: Object.values(players).map((p) => p.displayName),
    datasets: datasets.map(({ name, value }) => ({
      label: name,
      data: match.info.participants.map(value),
      borderColor: getColor,
      backgroundColor: getColor,
    })),
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const menu = (
    <ScrollArea orientation='vertical' className='flex max-h-screen'>
      <DataSelector onDatasetsChange={setDatasets} />
    </ScrollArea>
  );

  return (
    <div className='flex grow h-[calc(100vh-100px)] max-w-screen-2xl'>
      <div className='hidden md:flex'>{menu}</div>
      <div className='absolute top-4 right-4 z-10'>
        <Sheet>
          <SheetTrigger asChild>
            <Button className='w-12 h-12 p-0 md:hidden '>
              <Cog />
            </Button>
          </SheetTrigger>
          <SheetContent className='p-0 w-fit'>
            <SheetTitle className='hidden'>Datasets</SheetTitle>
            <SheetDescription className='hidden'>
              Select what datasets you want to show on the chart.
            </SheetDescription>
            {menu}
          </SheetContent>
        </Sheet>
      </div>
      <div className='relative grow mx-4 max-h-[1000px]'>
        <div className='absolute left-0 right-0 top-0 bottom-0'>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};
