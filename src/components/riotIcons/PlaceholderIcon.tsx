import { cn } from '@/lib/utils';

/** Props for {@link PlaceholderIcon}. */
export type PlaceholderIconProps = {
  /** The size of the icon (24, 32, or 48px). */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes to apply to the element. */
  className?: string;
};

/**
 * Returns classes to apply to an icon.
 *
 * @param size The size of the icon (24, 32, or 48px).
 * @returns Classes to apply to an icon.
 */
export const getIconClass = (size: 'lg' | 'md' | 'sm'): string =>
  cn('shadow-tile', {
    'w-12 h-12 rounded-lg': size === 'lg',
    'w-8 h-8 rounded-md': size === 'md',
    'w-6 h-6 rounded': size === 'sm',
  });

/** A blank icon to use as a placeholder. */
export const PlaceholderIcon = ({
  size = 'md',
  className = '',
}: PlaceholderIconProps): JSX.Element => (
  <div className={cn(getIconClass(size), 'bg-foreground/10', className)} />
);
