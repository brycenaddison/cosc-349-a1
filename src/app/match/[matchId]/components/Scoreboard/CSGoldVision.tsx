'use client';

import { useEffect, useState } from 'react';
import { useScoreboardControls } from '@/app/match/[matchId]/hooks';
import { Tooltip } from '@/components/Tooltip';
import { cn } from '@/lib/utils';

export type CSGoldVisionProps = {
  gold: number;
  cs: number;
  timePlayed: number;
  controlWards: number;
  wardsPlaced: number;
  wardsKilled: number;
  size?: 'sm' | 'md' | 'lg';
  group?: string;
};

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
  const [group, setGroup] = useState<'gold' | 'cs' | 'vision'>('gold');
  const { add } = useScoreboardControls(key);

  useEffect(() => {
    add({
      set: (string) => {
        setGroup(
          string === 'gold' ? 'gold' : string === 'cs' ? 'cs' : 'vision',
        );
      },
      values: ['gold', 'cs', 'vision'],
    });
  }, [add]);

  return (
    <div
      className={cn('flex flex-col text-gray-400 items-center shrink-0', {
        'text-lg w-32': size === 'lg',
        'text-sm w-24': size === 'md',
        'text-[.6rem] w-16 ': size === 'sm',
      })}
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
              <span className='text-gray-200 font-semibold'>
                {controlWards}
              </span>{' '}
              CW
            </div>
            <div>
              <span className='text-gray-200 font-semibold'>{wardsPlaced}</span>{' '}
              P /{' '}
              <span className='text-gray-200 font-semibold'>{wardsKilled}</span>{' '}
              K
            </div>
          </div>
        </Tooltip>
      ) : (
        <>
          <div className='font-semibold text-gray-200'>
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
