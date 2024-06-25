'use client';

import { useEffect, useState } from 'react';
import { useScoreboardControls } from '@/app/match/[matchId]/hooks';
import { ScoreboardIcon } from '@/components/riotIcons/ScoreboardIcon';
import { cn } from '@/lib/utils';

export type ControllerProps = {
  group: string;
  size?: 'sm' | 'md' | 'lg';
};

export const Controller = ({
  group,
  size = 'md',
}: ControllerProps): JSX.Element => {
  const [group1, setGroup1] = useState<'damage' | 'damageTaken' | 'cc'>(
    'damage',
  );
  const [group2, setGroup2] = useState<'gold' | 'cs' | 'vision'>('gold');

  const {
    add: add1,
    moveLeft: left1,
    moveRight: right1,
  } = useScoreboardControls(`${group}-dmg`);
  const {
    add: add2,
    moveLeft: left2,
    moveRight: right2,
  } = useScoreboardControls(`${group}-gold`);

  useEffect(() => {
    add1({
      set: (string) => {
        setGroup1(
          string === 'damage'
            ? 'damage'
            : string === 'damageTaken'
              ? 'damageTaken'
              : 'cc',
        );
      },
      values: ['damage', 'damageTaken', 'cc'],
    });
    add2({
      set: (string) => {
        setGroup2(
          string === 'gold' ? 'gold' : string === 'cs' ? 'cs' : 'vision',
        );
      },
      values: ['gold', 'cs', 'vision'],
    });
  }, [add1, add2]);

  const buttonClassName =
    'cursor-pointer select-none text-gray-400 hover:text-white transition-all duration-300';

  return (
    <div
      className={cn('flex', {
        'gap-2': size === 'lg',
        'gap-1.5': size === 'md',
        'gap-1': size === 'sm',
      })}
    >
      <div
        className={cn('justify-between flex text-white', {
          'w-32 px-4 text-lg': size === 'lg',
          'w-24 px-3 text-sm': size === 'md',
          'w-16 px-2 text-[0.6rem]': size === 'sm',
        })}
      >
        <div className={buttonClassName} onClick={left1}>
          <ScoreboardIcon type='leftarrow' size={size} />
        </div>
        <ScoreboardIcon
          type={
            group1 === 'damage'
              ? 'sword'
              : group1 === 'damageTaken'
                ? 'shield'
                : 'cc'
          }
          size={size}
        />
        <div className={buttonClassName} onClick={right1}>
          <ScoreboardIcon type='rightarrow' size={size} />
        </div>
      </div>
      <div
        className={cn('justify-between flex text-white', {
          'w-32 px-4 text-lg': size === 'lg',
          'w-24 px-3 text-sm': size === 'md',
          'w-16 px-2 text-[0.6rem]': size === 'sm',
        })}
      >
        <div className={buttonClassName} onClick={left2}>
          <ScoreboardIcon type='leftarrow' size={size} />
        </div>
        <ScoreboardIcon
          type={
            group2 === 'gold' ? 'gold' : group2 === 'cs' ? 'minions' : 'eye'
          }
          size={size}
        />

        <div className={buttonClassName} onClick={right2}>
          <ScoreboardIcon type='rightarrow' size={size} />
        </div>
      </div>
    </div>
  );
};
