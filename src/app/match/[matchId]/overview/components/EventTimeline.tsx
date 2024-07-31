import { useMemo, useState } from 'react';
import ResizeObserver from 'react-resize-observer';
import { useOverview } from './OverviewDashboard';

/** Shows a timeline of events by minute for filtering. */
export const EventTimeline = (): JSX.Element => {
  const { timeline, events, setMinute, minute: currentMinute } = useOverview();

  const [size, setSize] = useState(0);

  const { blueMinutes, redMinutes } = useMemo(
    () =>
      events.reduce<{
        blueMinutes: number[];
        redMinutes: number[];
      }>(
        ({ blueMinutes, redMinutes }, event) => {
          if (event.team === undefined) return { blueMinutes, redMinutes };

          const minute = Math.round(event.timestamp / 60000);
          const minutes = event.team === 100 ? blueMinutes : redMinutes;

          if (!minutes.includes(minute)) minutes.push(minute);

          return { blueMinutes, redMinutes };
        },
        {
          blueMinutes: [],
          redMinutes: [],
        },
      ),
    [events],
  );

  const length = useMemo(() => {
    const gameEnd = timeline.info.frames[
      timeline.info.frames.length - 1
    ].events.find((event) => event.type === 'GAME_END');

    if (!gameEnd) return 1;

    return Math.round(gameEnd.timestamp / 60000);
  }, [timeline]);

  return (
    <div className='w-full h-24 rounded-lg border border-border relative'>
      <div className='absolute h-0.5 bg-border top-6 left-6 right-6'>
        <ResizeObserver
          onResize={(rect) => {
            setSize(rect.width);
          }}
        />
        {blueMinutes.map((minute) => (
          <div
            className='absolute rounded-full h-3 w-3 -top-[4.5px] bg-blue-400 hover:scale-125 transition cursor-pointer'
            style={{ left: (minute / length) * size }}
            onClick={() => {
              setMinute(minute === currentMinute ? undefined : minute);
            }}
          />
        ))}
      </div>
      <div className='absolute h-0.5 bg-border bottom-6 left-6 right-6'>
        {redMinutes.map((minute) => (
          <div
            className='absolute rounded-full h-3 w-3 -top-[4.5px] bg-red-400 hover:scale-125 transition cursor-pointer'
            style={{ left: (minute / length) * size }}
            onClick={() => {
              setMinute(minute === currentMinute ? undefined : minute);
            }}
          />
        ))}
      </div>
    </div>
  );
};
