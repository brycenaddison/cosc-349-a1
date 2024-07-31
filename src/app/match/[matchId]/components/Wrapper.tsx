import { type ReactNode } from 'react';
import { navStyles } from '@/components/NavBar';
import { MenuButton } from '@/components/ui/MenuButton';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { cn } from '@/lib/utils';

/** Props for {@link Wrapper}. */
export type WrapperProps = {
  /** Which page is currently selected. */
  page: 'scoreboard' | 'builds' | 'overview';
  /** The match ID of the match. */
  matchId: string;
  /** The content of the page. */
  children: ReactNode;
};

/** A nav header for the scoreboard page. */
export const Wrapper = ({
  children,
  page,
  matchId,
}: WrapperProps): JSX.Element => {
  return (
    <>
      <div
        className={cn(
          navStyles,
          'top-[57px] border-b overflow-y-scroll scrollbar-hidden',
        )}
      >
        <div className='flex mx-auto w-fit'>
          <MenuButton
            href={`/match/${matchId}/`}
            selected={page === 'scoreboard'}
          >
            Scoreboard
          </MenuButton>
          <MenuButton
            href={`/match/${matchId}/builds`}
            selected={page === 'builds'}
          >
            Builds
          </MenuButton>
          <MenuButton
            href={`/match/${matchId}/overview`}
            selected={page === 'overview'}
          >
            Overview
          </MenuButton>
        </div>
      </div>
      <ScrollArea orientation='both' className='flex grow'>
        <div className='flex flex-col overflow-hidden mt-3 max-w-screen-2xl mx-auto'>
          {children}
        </div>
      </ScrollArea>
    </>
  );
};
