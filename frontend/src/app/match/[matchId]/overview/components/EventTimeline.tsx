import { useMemo, useState } from 'react';
import ResizeObserver from 'react-resize-observer';
import { useOverview } from './OverviewDashboard';

/** The size of the smallest timeline dot, in px. */
const minDotSize = 4;

/** The size of the largest timeline dot, in px. */
const maxDotSize = 32;

/** Shows a timeline of events by minute for filtering. */
export const EventTimeline = (): JSX.Element => {
  const {
    timeline,
    allEvents: events,
    setMinute,
    minute: currentMinute,
  } = useOverview();

  const [size, setSize] = useState(0);

  const { blueMinutes, redMinutes, getDotStyle } = useMemo(() => {
    let maxCount = 1;

    const minutes = events.reduce<{
      blueMinutes: { minute: number; count: number }[];
      redMinutes: { minute: number; count: number }[];
    }>(
      ({ blueMinutes, redMinutes }, event) => {
        if (event.team === undefined) return { blueMinutes, redMinutes };

        const minute = Math.round(event.timestamp / 60000);
        const minutes = event.team === 100 ? blueMinutes : redMinutes;

        const minuteObject = minutes.find((o) => o.minute === minute);

        if (minuteObject === undefined) {
          minutes.push({
            minute,
            count: 1,
          });
        } else {
          minuteObject.count += 1;
          if (minuteObject.count > maxCount) {
            maxCount = minuteObject.count;
          }
        }

        return { blueMinutes, redMinutes };
      },
      {
        blueMinutes: [],
        redMinutes: [],
      },
    );

    return {
      getDotStyle: ({
        minute,
        count,
        size,
        length,
      }: {
        minute: number;
        count: number;
        size: number;
        length: number;
      }) => {
        const dotSize =
          (count / maxCount) * (maxDotSize - minDotSize) + minDotSize;
        const offset = dotSize / -2;

        return {
          height: dotSize,
          width: dotSize,
          left: (minute / length) * size + offset,
          top: offset + 1,
        };
      },
      ...minutes,
    };
  }, [events]);

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
        {blueMinutes.map(({ minute, count }) => (
          <div
            key={minute}
            className='absolute rounded-full bg-blue-400 hover:scale-110 transition cursor-pointer'
            style={getDotStyle({ minute, count, size, length })}
            onClick={() => {
              setMinute(minute === currentMinute ? undefined : minute);
            }}
          />
        ))}
      </div>
      <div className='absolute h-0.5 bg-border bottom-6 left-6 right-6'>
        {redMinutes.map(({ minute, count }) => (
          <div
            key={minute}
            className='absolute rounded-full bg-red-400 hover:scale-110 transition cursor-pointer'
            style={getDotStyle({ minute, count, size, length })}
            onClick={() => {
              setMinute(minute === currentMinute ? undefined : minute);
            }}
          />
        ))}
      </div>
    </div>
  );
};
