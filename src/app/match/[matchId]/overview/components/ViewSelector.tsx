'use client';

import { useOverview } from './OverviewDashboard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

/** A chart type to show. */
export type ViewOption = {
  graph: (typeof graphOptions)[number];
  stat: (typeof statOptions)[number];
};

/** A list of chart types. */
const graphOptions = [
  'Team Advantage',
  'Team Total',
  'Champion Total',
] as const;

/** A list of stat types. */
const statOptions = ['Gold', 'Experience', 'CS', 'Damage'] as const;

export const defaultView: ViewOption = {
  graph: graphOptions[0],
  stat: statOptions[0],
};

/** A dropdown menu configured to select a chart type. */
export const ViewSelector = (): JSX.Element => {
  const {
    view: { graph, stat },
    setView,
  } = useOverview();

  return (
    <div className='flex gap-2'>
      <Select
        value={graph}
        onValueChange={(value) => {
          setView({ stat, graph: value as ViewOption['graph'] });
        }}
      >
        <SelectTrigger className='w-40'>
          <SelectValue placeholder='Theme' />
        </SelectTrigger>
        <SelectContent>
          {graphOptions.map((option) => {
            return (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Select
        value={stat}
        onValueChange={(value) => {
          setView({ graph, stat: value as ViewOption['stat'] });
        }}
      >
        <SelectTrigger className='w-32'>
          <SelectValue placeholder='Theme' />
        </SelectTrigger>
        <SelectContent>
          {statOptions.map((option) => {
            return (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
