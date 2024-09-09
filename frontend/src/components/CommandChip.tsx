'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { getCommandKey } from '@/lib/utils';

/** Props for {@link CommandChip}. */
export type CommandChipProps = {
  /** The keys to show in the command chip. */
  children: ReactNode;
};

/**
 * A client component for showing the correct command key for the operating
 * system.
 */
export const CommandChip = ({ children }: CommandChipProps): JSX.Element => {
  const [commandKey, setCommandKey] = useState<string | undefined>();

  useEffect(() => {
    setCommandKey(getCommandKey());
  }, []);

  if (commandKey === undefined) return <></>;

  return (
    <kbd className='pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 md:flex'>
      {commandKey} {children}
    </kbd>
  );
};
