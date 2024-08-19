import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { type ReactNode, Suspense } from 'react';
import Loading from '@/app/loading';
import { Providers } from '@/app/providers';
import { NavBar } from '@/components/NavBar';
import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export default ({ children }: { children: ReactNode }): ReactNode => {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'flex flex-col min-h-screen antialiased font-sans bg-background',
          fontSans.variable,
        )}
      >
        <Providers
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
};
