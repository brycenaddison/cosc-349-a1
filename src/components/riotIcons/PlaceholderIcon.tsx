import { cn } from '@/lib/utils';

export type PlaceholderIconProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const getIconClass = (size: 'lg' | 'md' | 'sm'): string =>
  cn('shadow-tile', {
    'w-12 h-12 rounded-lg': size === 'lg',
    'w-8 h-8 rounded-md': size === 'md',
    'w-6 h-6 rounded': size === 'sm',
  });

export const PlaceholderIcon = ({
  size = 'md',
  className = '',
}: PlaceholderIconProps): JSX.Element => (
  <div className={cn(getIconClass(size), 'bg-foreground/10', className)} />
);
