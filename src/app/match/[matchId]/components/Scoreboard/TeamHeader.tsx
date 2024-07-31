'use client';

import { ScoreboardIcon } from '@/components/riotIcons/ScoreboardIcon';
import { cn } from '@/lib/utils';

/** Props for {@link TeamHeader}. */
export type TeamHeaderProps = {
  /** The name of the team. */
  teamName: string;
  /** Whether the team won the match. */
  win: boolean;
  /** The team's total kills. */
  kills: number;
  /** The team's total deaths. */
  deaths: number;
  /** The team's total assists. */
  assists: number;
  /** The team's total gold. */
  gold: number;
  /** The size of the scoreboard component. */
  size: 'sm' | 'md' | 'lg';
  /** The objectives taken by the team. */
  objectives: Riot.MatchV5.Objective;
  /** The team's bans in the match. */
  bans: Riot.MatchV5.Ban[];
};

/** Header stats and controllers for each team scoreboard. */
export const TeamHeader = ({
  win,
  size,
  teamName,
  kills,
  deaths,
  assists,
  gold,
  // TODO: Add bans/objectives data to scoreboard
}: TeamHeaderProps): JSX.Element => {
  return (
    <div
      className={cn('flex font-semibold shrink-0 items-center', {
        'text-2xl p-2 gap-2': size === 'lg',
        'text-lg p-1.5 gap-1.5 ': size === 'md',
        'text-sm p-1 gap-1': size === 'sm',
        'text-blue-500': win,
        'text-red-500': !win,
      })}
    >
      <div className='font-bold'>{win ? 'Victory' : 'Defeat'}</div>
      <div className='font-normal text-gray-500'>({teamName})</div>
      <div className='dark:text-gray-600 text-gray-400'>·</div>
      <ScoreboardIcon type='kda' size={size} />
      <div>
        {kills} / {deaths} / {assists}
      </div>
      <div className='dark:text-gray-600 text-gray-400'>·</div>
      <ScoreboardIcon type='gold' size={size} />
      <div>{gold.toLocaleString()}</div>
      <div
        className={cn('ml-auto items-center', {
          'w-32': size === 'lg',
          'w-24': size === 'md',
          'w-16': size === 'sm',
        })}
      ></div>
    </div>
  );
};
