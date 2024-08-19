'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { type ReactNode, useState } from 'react';

/** Props for {@link StatSection}. */
export type StatSectionProps = {
  /** A label to show in the collapsible header. */
  label: string;
  /** The table rows to wrap. */
  children: ReactNode;
};

/** A collapsible section for the stat table. */
export const StatSection = ({
  label,
  children,
}: StatSectionProps): JSX.Element => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <tr
        onClick={() => {
          setOpen(!open);
        }}
      >
        <td colSpan={12}>
          <div className='flex items-center border-b w-full rounded border-border font-bold p-1'>
            {open ? (
              <ChevronDown className='w-4 lg:w-6 2xl:w-8 mr-1' />
            ) : (
              <ChevronUp className='w-4 lg:w-6 2xl:w-8 mr-1' />
            )}
            {label}
          </div>
        </td>
      </tr>
      {open && children}
    </>
  );
};
