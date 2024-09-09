import { EventText } from './EventList/EventText';
import { useOverview } from './OverviewDashboard';
import { cn, formatTimestamp } from '@/lib/utils';

/**
 * Represents an event in the event list.
 *
 * We choose to merge special kills with champion kills, since these
 * events are always paired together.
 */
export type ListEvent = Riot.MatchV5.TimelineEvent &
  (
    | {
        type: Exclude<
          Riot.MatchV5.TimelineEvent['type'],
          'CHAMPION_SPECIAL_KILL' | 'CHAMPION_KILL'
        >;
      }
    | {
        type: 'CHAMPION_KILL';
        specialKill?: Riot.MatchV5.TimelineEvent<'CHAMPION_SPECIAL_KILL'>;
      }
  );

/**
 * A list of timeline events with timestamps.
 *
 * Uses the context for timeline data, and what types and players to filter on.
 */
export const EventList = (): JSX.Element => {
  const { events } = useOverview();

  return (
    <div className='flex flex-col h-full gap-2 mb-6'>
      {events.length === 0 && (
        <div className='mx-auto italic text-foreground/60'>
          No events to show.
        </div>
      )}
      {events.map((event) => (
        <div
          key={`${event.type}${event.timestamp}`}
          className='flex w-full min-h-12 border rounded-lg border-border'
          onClick={() => {
            console.log(event);
          }}
        >
          <div
            className={cn(
              'flex items-center justify-center max-w-16 w-16 grow font-bold',
              'rounded-tl-lg rounded-bl-lg bg-primary text-white shrink-0',
              {
                'bg-blue-500': event.team === 100,
                'bg-red-500': event.team === 200,
              },
            )}
          >
            {formatTimestamp(event.timestamp)}
          </div>
          <div className='my-auto ml-4 py-0.5 grow text-wrap'>
            <EventText event={event} />.
          </div>
        </div>
      ))}
    </div>
  );
};
