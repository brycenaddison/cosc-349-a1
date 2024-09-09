import Image from 'next/image';
import { cn } from '@/lib/utils';

/** The link to a directory of role icons. */
const rolePath =
  'https://raw.communitydragon.org/pbe/plugins/rcp-fe-lol-static-assets/global/default/svg/';

/** Props for {@link Role}. */
export type RoleProps = {
  /** The role icon to show. */
  role: Riot.MatchV5.Role;
  /** The size of the icon (24, 32, or 48px). */
  size?: 'sm' | 'md' | 'lg';
};

/** A wrapped icon representing a role. */
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
      src={`${rolePath}position-${role.toLowerCase()}.svg`}
      fill={true}
      alt={role}
    />
  </div>
);
