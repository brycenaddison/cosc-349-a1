'use client';

import { useEffect, useState } from 'react';
import { useScoreboardControls } from '@/app/match/[matchId]/hooks';
import { cn } from '@/lib/utils';

export type DamageMeterProps = {
  damage: number;
  maxDamage: number;
  damageTaken: number;
  maxDamageTaken: number;
  cc: number;
  maxCC: number;
  matchId?: string;
  size?: 'sm' | 'md' | 'lg';
  group?: string;
};

export const DamageMeter = ({
  size = 'md',
  damage,
  damageTaken,
  cc,
  maxDamage,
  maxDamageTaken,
  maxCC,
  group: key,
}: DamageMeterProps): JSX.Element => {
  const [group, setGroup] = useState<'damage' | 'damageTaken' | 'cc'>('damage');
  const { add } = useScoreboardControls(key);

  useEffect(() => {
    add({
      set: (string) => {
        setGroup(
          string === 'damage'
            ? 'damage'
            : string === 'damageTaken'
              ? 'damageTaken'
              : 'cc',
        );
      },
      values: ['damage', 'damageTaken', 'cc'],
    });
  }, [add]);

  const stat =
    group === 'damage' ? damage : group === 'damageTaken' ? damageTaken : cc;
  const maxStat =
    group === 'damage'
      ? maxDamage
      : group === 'damageTaken'
        ? maxDamageTaken
        : maxCC;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center h-full shrink-0',
        {
          'gap-2 w-32': size === 'lg',
          'gap-1.5 w-24': size === 'md',
          'gap-1 w-16': size === 'sm',
        },
      )}
    >
      <div
        className={cn({
          'text-[.6rem]': size === 'sm',
          'text-sm': size === 'md',
          'text-xl': size === 'lg',
          'font-semibold text-glow shadow-white': stat === maxStat,
        })}
      >
        {stat.toLocaleString()}
      </div>
      <div
        className={cn(
          'relative rounded-full bg-blue-900 transition-all duration-300',
          {
            'w-12 h-1': size === 'sm',
            'w-16 h-1.5': size === 'md',
            'w-24 h-2': size === 'lg',
            'bg-blue-900': group === 'damage',
            'bg-green-900': group === 'damageTaken',
            'bg-purple-900': group === 'cc',
          },
        )}
      >
        <div
          className={cn(
            'absolute top-0 left-0 rounded-full transition-all duration-300',
            {
              'h-1': size === 'sm',
              'h-1.5': size === 'md',
              'h-2': size === 'lg',
              'bg-blue-400': group === 'damage',
              'bg-green-400': group === 'damageTaken',
              'bg-purple-400': group === 'cc',
            },
          )}
          style={{
            width: `${(stat * 100) / maxStat}%`,
          }}
        />
      </div>
    </div>
  );
};
