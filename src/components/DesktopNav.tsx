'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { H1 } from '@/components/ui/H1';
import { links } from '@/config/config';
import { cn } from '@/lib/utils';

export const DesktopNav = (): JSX.Element => {
  const pathname = usePathname();

  return (
    <div className='mr-4 hidden md:flex'>
      <Link href='/' className='mr-4'>
        <H1 className='transition duration-200'>Stats</H1>
      </Link>
      <nav className='flex items-center gap-4 text-sm lg:gap-6'>
        {links.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              'transition-colors hover:text-foreground/80',
              pathname === href ? 'text-foreground' : 'text-foreground/60',
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
};
