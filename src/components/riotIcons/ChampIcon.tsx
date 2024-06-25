import Image from 'next/image';
import { cn } from '@/lib/utils';

// base 360x360
const BASE_URL =
  'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/';

export type ChampIconProps = {
  champId?: number;
  size?: 'sm' | 'md' | 'lg';
};

export const ChampIcon = ({
  champId = -1,
  size = 'lg',
}: ChampIconProps): JSX.Element => (
  <div
    className={cn('overflow-hidden rounded-lg shadow-tile', {
      'w-8 h-8': size === 'sm',
      'w-12 h-12': size === 'md',
      'w-16 h-16': size === 'lg',
    })}
  >
    <Image
      src={`${BASE_URL}${champId}.png`}
      width={360}
      height={360}
      alt={`Champion ${champId}`}
      className='object-center scale-[115%]'
    />
  </div>
);
