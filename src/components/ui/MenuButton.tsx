import Link from 'next/link';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type MenuButtonProps = {
  children: ReactNode;
  selected: boolean;
  href: string;
};

export const MenuButton = ({
  children,
  selected,
  href,
}: MenuButtonProps): JSX.Element => {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        'border-transparent transition duration-300 border-b-2 hover:bg-foreground/10 hover:border-primary/50 text-base font-normal',
        {
          'pointer-events-none border-primary': selected,
        },
      )}
    >
      <div className='items-center text-center p-2 h-10 justify-center w-32'>
        {children}
      </div>
    </Link>
  );
};
