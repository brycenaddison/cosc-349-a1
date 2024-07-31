import Image from 'next/image';
import { EventText } from './EventList/EventText';
import { useOverview } from './OverviewDashboard';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn, formatTimestamp } from '@/lib/utils';

// these are guesses
const mapSize = 14920;
const offsetX = 40;
const offsetY = 0;

/** How large to make the Rift map, in px. */
const mapImageSize = 512;
/** How large to make event icons, in px. */
const iconSize = 8;

/**
 * Returns CSSProperties given a position on the Summoner's Rift map from the
 * API.
 */
const placeIcon = ({
  x,
  y,
}: Riot.MatchV5.Position): { left: number; bottom: number } => ({
  left: ((x + offsetX) / mapSize) * mapImageSize - iconSize / 2,
  bottom: ((y + offsetY) / mapSize) * mapImageSize - iconSize / 2,
});

/** An event map overlaid on Summoner's Rift. */
export const RiftMap = (): JSX.Element => {
  const { hoveredPlayer, events } = useOverview();

  const killEvents = events.filter((event) => event.type === 'CHAMPION_KILL');

  return (
    <div
      className='relative overflow-hidden border shrink-0 rounded-xl border-border'
      style={{ height: mapImageSize, width: mapImageSize }}
    >
      <Image
        src='/images/map.png'
        height={512}
        width={512}
        alt="Summoner's Rift Map"
      />
      {killEvents.map((event, index) => (
        <div
          key={index}
          className={cn(
            'absolute rounded-full border border-border h-full',
            event.team === 100 ? 'bg-blue-500' : 'bg-red-500',
            {
              'opacity-20':
                hoveredPlayer !== undefined &&
                hoveredPlayer !== event.killerId &&
                hoveredPlayer !== event.victimId &&
                !(event.assistingParticipantIds ?? []).includes(hoveredPlayer),
            },
          )}
          style={{
            height: iconSize,
            width: iconSize,
            ...placeIcon(event.position),
          }}
        >
          <Tooltip
            className='absolute'
            tooltip={
              <div className='max-w-60 overflow-hidden inline'>
                <span className='font-bold'>
                  {formatTimestamp(event.timestamp)}
                  :&nbsp;
                </span>
                <EventText event={event} />.
              </div>
            }
          >
            <div
              style={{
                height: iconSize,
                width: iconSize,
              }}
            />
          </Tooltip>
        </div>
      ))}
    </div>
  );
};
