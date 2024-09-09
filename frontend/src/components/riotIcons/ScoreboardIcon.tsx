import Image from 'next/image';

import KDA from '@/../public/svg/scoreboard-kda-icon.svg';
import Arrow from '@/../public/svg/scoreboard-stat-switcher-arrow.svg';
import CC from '@/../public/svg/scoreboard-stat-switcher-cc-score.svg';
import Vision from '@/../public/svg/scoreboard-stat-switcher-eye.svg';
import Minions from '@/../public/svg/scoreboard-stat-switcher-minions-slain.svg';
import DamageTaken from '@/../public/svg/scoreboard-stat-switcher-shield.svg';
import Damage from '@/../public/svg/scoreboard-sword-icon.svg';

import { cn } from '@/lib/utils';

/** Props for {@link ScoreboardIcon}. */
export type ScoreboardIconProps = {
  size?: 'sm' | 'md' | 'lg';
  type:
    | 'leftarrow'
    | 'kda'
    | 'sword'
    | 'shield'
    | 'cc'
    | 'minions'
    | 'eye'
    | 'gold'
    | 'rightarrow';
};

/** Represents an icon on the scoreboard. */
export const ScoreboardIcon = ({
  size = 'md',
  type,
}: ScoreboardIconProps): JSX.Element => {
  const iconSize = 32;

  const className = cn('fill-current text-foreground', {
    'w-3 h-3': size === 'sm',
    'w-[1.125rem] h-[1.125rem]': size === 'md',
    'w-6 h-6': size === 'lg',
  });

  if (type === 'gold') {
    return (
      <div className={className}>
        <Image
          className='grayscale invert dark:invert-0'
          src='/images/mask-icon-gold.png'
          width={iconSize}
          height={iconSize}
          alt={type}
        />
      </div>
    );
  }

  if (type === 'leftarrow') {
    return <Arrow className={className} />;
  }

  if (type === 'rightarrow') {
    return <Arrow className={cn(className, 'rotate-180')} />;
  }

  if (type === 'kda') {
    return <KDA className={className} />;
  }

  if (type === 'sword') {
    return <Damage className={className} />;
  }

  if (type === 'shield') {
    return <DamageTaken className={className} />;
  }

  if (type === 'cc') {
    return <CC className={className} />;
  }

  if (type === 'minions') {
    return <Minions className={className} />;
  }

  return <Vision className={className} />;
};
