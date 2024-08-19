'use client';

import { FileIcon, Laptop, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { CommandChip } from '@/components/CommandChip';
import { Button } from '@/components/ui/Button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/Command';
import { links } from '@/config/config';
import { cn } from '@/lib/utils';

/** Props for {@link CommandMenu}. */
export type CommandMenuProps = {
  /** Whether to show the menu button or the menu itself. */
  noButton?: boolean;
};

/** A command menu component allowing navigation of the website. */
export const CommandMenu = ({
  noButton = false,
}: CommandMenuProps): JSX.Element => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent): void => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => {
      document.removeEventListener('keydown', down);
    };
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const commandComponent = (
    <>
      <CommandInput placeholder='Search...' />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading='Links'>
          {links.map((link) => (
            <CommandItem
              key={link.href}
              value={link.label}
              onSelect={() => {
                runCommand(() => {
                  router.push(link.href);
                });
              }}
            >
              <FileIcon className='mr-2 h-4 w-4' />
              {link.label}
            </CommandItem>
          ))}
        </CommandGroup>
        {/* {docsConfig.sidebarNav.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem) => (
                <CommandItem
                  key={navItem.href}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as string));
                  }}
                >
                  <div className='mr-2 flex h-4 w-4 items-center justify-center'>
                    <CircleIcon className='h-3 w-3' />
                  </div>
                  {navItem.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))} */}
        <CommandSeparator />
        <CommandGroup heading='Theme'>
          <CommandItem
            onSelect={() => {
              runCommand(() => {
                setTheme('light');
              });
            }}
          >
            <Sun className='mr-2 h-4 w-4' />
            <span>Light</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => {
                setTheme('dark');
              });
            }}
          >
            <Moon className='mr-2 h-4 w-4' />
            <span>Dark</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(() => {
                setTheme('system');
              });
            }}
          >
            <Laptop className='mr-2 h-4 w-4' />
            <span>System</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );

  if (noButton) {
    return (
      <div className='rounded-md border border-border'>
        <Command>{commandComponent}</Command>
      </div>
    );
  }

  return (
    <>
      <Button
        variant='outline'
        className={cn(
          'relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64',
        )}
        onClick={() => {
          setOpen(true);
        }}
      >
        <span className='hidden lg:inline-flex'>Search website...</span>
        <span className='inline-flex lg:hidden'>Search...</span>
        <CommandChip>K</CommandChip>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        {commandComponent}
      </CommandDialog>
    </>
  );
};
