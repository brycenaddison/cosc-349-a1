import { X } from 'lucide-react';
import { useOverview } from './OverviewDashboard';
import { ChampIcon } from '@/components/riotIcons/ChampIcon';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

/**
 * Displays a strip of champion icons, with callbacks for selection and
 * hovering.
 */
export const PlayerSelector = (): JSX.Element => {
  const {
    players,
    selectedPlayers: selected,
    hoveredPlayer: hovered,
    setHoveredPlayer,
    setSelectedPlayers,
  } = useOverview();

  return (
    <div className='flex'>
      {Object.values(players).map((player) => {
        const isSelected =
          selected.length === 0 || selected.includes(player.participantId);
        const isHovered = hovered === player.participantId;
        const isNotHovered =
          hovered !== undefined && hovered !== player.participantId;

        return (
          <div
            onMouseEnter={() => {
              setHoveredPlayer(player.participantId);
            }}
            onMouseLeave={() => {
              setHoveredPlayer(undefined);
            }}
            onClick={() => {
              const id = player.participantId;

              if (selected.includes(id)) {
                setSelectedPlayers((ids) =>
                  ids.filter((otherId) => otherId !== id),
                );
                return;
              }

              if (selected.length >= Object.values(players).length - 1) {
                setSelectedPlayers([]);
                return;
              }

              setSelectedPlayers((ids) => [...ids, id]);
            }}
            className={cn('relative transition px-1', {
              grayscale: !isSelected && !isHovered,
            })}
          >
            <ChampIcon size='md' champId={player.championId} />
            <div
              className={cn(
                isSelected && isNotHovered ? 'opacity-100' : 'opacity-0',
                'absolute top-0 bottom-0 left-1 right-1 bg-white/50 rounded-lg transition',
              )}
            />

            <div
              className={cn(
                !isSelected && !isHovered ? 'opacity-100' : 'opacity-0',
                'absolute top-0 bottom-0 left-1 right-1 bg-gray-500/50 rounded-lg transition',
              )}
            />
          </div>
        );
      })}
      <Tooltip disabled={selected.length === 0} tooltip='Clear selection'>
        <Button
          asChild
          className={cn('h-12 w-12 text-background p-2 ml-1', {
            'pointer-events-none bg-foreground/20': selected.length === 0,
          })}
        >
          <X
            onClick={() => {
              setSelectedPlayers([]);
            }}
          />
        </Button>
      </Tooltip>
    </div>
  );
};
