'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export const Providers = ({
  children,
  ...props
}: ThemeProviderProps): JSX.Element => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
