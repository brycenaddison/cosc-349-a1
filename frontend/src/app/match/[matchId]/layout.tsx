'use client';

import { usePathname } from 'next/navigation';
import { type ReactNode, Suspense } from 'react';
import Loading from '@/app/loading';
import { navStyles } from '@/components/NavBar';
import { MenuButton } from '@/components/ui/MenuButton';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { cn } from '@/lib/utils';

const pages = [
  { name: 'Scoreboard', path: '' },
  { name: 'Graphs', path: 'graphs' },
  { name: 'Builds', path: 'builds' },
  { name: 'Overview', path: 'overview' },
] as const;

/** A nav header for the scoreboard page. */
export default function Layout({
  children,
  params: { matchId },
}: {
  children: ReactNode;
  params: { matchId: string };
}): JSX.Element {
  // This just cannot be the best way to do this but w/e
  const pathname = usePathname();

  const pathParts = pathname.split('/');
  const lastPath = pathParts[pathParts.length - 1];
  const selectedPage = pages.find(({ path }) => lastPath === path) ?? pages[0];

  return (
    <>
      <div
        className={cn(
          navStyles,
          'top-[57px] border-b overflow-y-scroll scrollbar-hidden',
        )}
      >
        <div className='flex mx-auto w-fit'>
          {pages.map((page) => (
            <MenuButton
              key={page.name}
              href={`/match/${matchId}/${page.path}`}
              selected={selectedPage === page}
            >
              {page.name}
            </MenuButton>
          ))}
        </div>
      </div>
      <Suspense key={selectedPage.name} fallback={<Loading />}>
        <ScrollArea orientation='both' className='flex grow'>
          <div className='flex flex-col overflow-hidden max-w-screen-2xl mx-auto'>
            {children}
          </div>
        </ScrollArea>
      </Suspense>
    </>
  );
}
