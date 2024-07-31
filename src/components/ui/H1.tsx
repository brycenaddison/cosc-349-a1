import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type H1Props = {
  className?: string;
  children: ReactNode;
};

export const H1 = ({ children, className }: H1Props): JSX.Element => {
  return <h1 className={cn(className, 'text-3xl font-bold')}>{children}</h1>;
};
