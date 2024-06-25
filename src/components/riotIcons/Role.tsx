import Image from 'next/image';
import { cn } from '@/lib/utils';

const ROLE_PATH =
  'https://raw.communitydragon.org/pbe/plugins/rcp-fe-lol-static-assets/global/default/svg/';

export type RoleProps = {
  role: Riot.MatchV5.Role;
  size?: 'sm' | 'md' | 'lg';
};

export const Role = ({ role, size = 'md' }: RoleProps): JSX.Element => (
  <div
    className={cn('relative shrink-0', {
      'w-6 h-6': size === 'sm',
      'w-8 h-8': size === 'md',
      'w-12 h-12': size === 'lg',
    })}
  >
    <Image
      className='object-center object-cover'
      src={`${ROLE_PATH}position-${role.toLowerCase()}.svg`}
      fill={true}
      alt={role}
    />
  </div>
);
