'use client';

import { useScoreboardControls } from './use-scoreboard-controls';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

/** Props for {@link CSGoldVision}. */
export type CSGoldVisionProps = {
  /** A player's total gold at the end of a match. */
  gold: number;
  /** A player's total farm at the end of a match. */
  cs: number;
  /** The length of the game, in seconds. */
  timePlayed: number;
  /** The number of control wards a player purchased by the end of a match. */
  controlWards: number;
  /** The number of wards a player placed by the end of a match. */
  wardsPlaced: number;
  /** The number of wards a player killed by the end of a match. */
  wardsKilled: number;
  /** The size of the scoreboard component. */
  size?: 'sm' | 'md' | 'lg';
  /** The key of the controller to use to navigate. */
  group?: string;
};

/**
 * Shows the farm, gold, or vision stats of a player at the end of a match,
 * navigable using the scoreboard column controller.
 */
export const CSGoldVision = ({
  gold,
  cs,
  timePlayed,
  controlWards,
  wardsPlaced,
  wardsKilled,
  size = 'md',
  group: key,
}: CSGoldVisionProps): JSX.Element => {
  const { value: group } = useScoreboardControls(['gold', 'cs', 'vision'], key);

  return (
    <div
      className={cn(
        'flex flex-col dark:text-gray-400 text-gray-500 items-center shrink-0',
        {
          'text-lg w-32': size === 'lg',
          'text-sm w-24': size === 'md',
          'text-[.6rem] w-16 ': size === 'sm',
        },
      )}
    >
      {group === 'vision' ? (
        <Tooltip
          tooltip={
            <div className='flex flex-col text-gray-400'>
              <div>
                <span className='text-white font-semibold'>{controlWards}</span>{' '}
                wards purchased
              </div>
              <div>
                <span className='text-white font-semibold'>{wardsPlaced}</span>{' '}
                wards placed
              </div>
              <div>
                <span className='text-white font-semibold'>{wardsKilled}</span>{' '}
                wards killed
              </div>
            </div>
          }
        >
          <div className='flex flex-col items-center'>
            <div>
              <span className='dark:text-gray-200 text-gray-800 font-semibold'>
                {controlWards}
              </span>{' '}
              CW
            </div>
            <div>
              <span className='dark:text-gray-200 text-gray-800 font-semibold'>
                {wardsPlaced}
              </span>{' '}
              P /{' '}
              <span className='dark:text-gray-200 text-gray-800 font-semibold'>
                {wardsKilled}
              </span>{' '}
              K
            </div>
          </div>
        </Tooltip>
      ) : (
        <>
          <div className='font-semibold dark:text-gray-200 text-gray-800'>
            {(group === 'gold' ? gold : cs).toLocaleString()}
          </div>
          <div>
            {(((group === 'gold' ? gold : cs) * 60) / timePlayed).toFixed(
              group === 'gold' ? 0 : 1,
            )}{' '}
            / min
          </div>
        </>
      )}
    </div>
  );
};
