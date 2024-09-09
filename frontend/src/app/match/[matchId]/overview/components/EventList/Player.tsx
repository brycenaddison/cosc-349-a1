import { useOverview } from '../OverviewDashboard';
import { ChampIcon } from '@/components/riotIcons/ChampIcon';
import { cn } from '@/lib/utils';

/** Props for {@link Player}. */
export type PlayerProps = {
  /** The player's participant ID. */
  id: number;
};

/** A small champion icon and player name grouped together to use on the Overview page. */
export const Player = ({ id }: PlayerProps): JSX.Element => {
  const { players } = useOverview();

  const { championId, displayName, teamId } =
    id in players
      ? players[id]
      : {
          championId: undefined,
          displayName: 'Unknown Player',
          teamId: undefined,
        };

  return (
    <div
      className={cn(
        'relative inline-block font-bold leading-none',
        teamId !== undefined &&
          (teamId === 100 ? 'text-blue-500' : 'text-red-500'),
      )}
    >
      <div className='absolute left-0'>
        <ChampIcon size='xs' champId={championId} />
      </div>
      <span className='pl-5'>{displayName}</span>
    </div>
  );
};
