import { CommandMenu } from '@/components/CommandMenu';
import { DesktopNav } from '@/components/DesktopNav';
import { MobileNav } from '@/components/MobileNav';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

export const navStyles =
  'sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-separate';

export const NavBar = (): JSX.Element => (
  <header className={cn(navStyles, 'border-b')}>
    <div className='container flex items-center h-14 max-w-screen-2xl'>
      <DesktopNav />
      <MobileNav />
      <div className='flex items-center justify-between flex-1 space-x-2 md:justify-end'>
        <div className='flex-1 w-full md:w-auto md:flex-none'>
          <CommandMenu />
        </div>
        <nav className='flex items-center'>
          <ThemeToggle />
        </nav>
      </div>
    </div>
  </header>
);
