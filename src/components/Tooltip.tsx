'use client';

import {
  FloatingPortal,
  type Placement,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react';

import { type ReactNode, useState } from 'react';

const OFFSET = 4;
const PADDING = 4;

export type TooltipProps = {
  tooltip: ReactNode;
  children?: ReactNode;
  placement?: Placement;
  delay?: number | Partial<{ open: number; close: number }>;
};

export const Tooltip = ({
  tooltip = 'Tooltip',
  placement = 'top',
  children,
  delay = {
    open: 300,
    close: 0,
  },
}: TooltipProps): JSX.Element => {
  const [open, setOpen] = useState(false);

  const floating = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      // Distance between activator and content.
      offset(OFFSET),
      // Positions content above or below if they won't be visible.
      flip({ padding: PADDING }),
      // Space between content and edge of screen/container.
      shift({ padding: PADDING }),
    ],
  });

  const hoverContext = useHover(floating.context, {
    delay,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hoverContext,
  ]);

  const tooltipStyles =
    'px-2 py-1 font-semibold text-sm bg-gray-900 rounded-md border border-gray-700 max-w-screen-sm w-fit';

  return (
    <>
      <div
        className='inline-block'
        ref={floating.refs.setReference}
        {...getReferenceProps()}
      >
        {children}
      </div>
      {open && (
        <FloatingPortal>
          <div
            ref={floating.refs.setFloating}
            className={tooltipStyles}
            style={{
              position: floating.strategy,
              top: floating.y,
              left: floating.x,
            }}
            {...getFloatingProps()}
          >
            {tooltip}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
