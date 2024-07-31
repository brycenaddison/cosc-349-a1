'use client';

import { useScoreboardControls } from './use-scoreboard-controls';
import { ScoreboardIcon } from '@/components/riotIcons/ScoreboardIcon';
import { cn } from '@/lib/utils';

/** Props for {@link Controller}. */
export type ControllerProps = {
  /** The unique key to use for the carousel controller. */
  group: string;
  /** The size of the scoreboard component. */
  size?: 'sm' | 'md' | 'lg';
};

/**
 * A component of the scoreboard header to control the data showing in the
 * rightmost columns.
 */
export const Controller = ({
  group,
  size = 'md',
}: ControllerProps): JSX.Element => {
  const {
    moveLeft: left1,
    moveRight: right1,
    value: group1,
  } = useScoreboardControls(['damage', 'damageTaken', 'cc'], group);

  const {
    moveLeft: left2,
    moveRight: right2,
    value: group2,
  } = useScoreboardControls(['gold', 'cs', 'vision'], group);

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
