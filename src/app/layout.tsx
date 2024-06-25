import './globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { type ReactNode } from 'react';
import { NavBar } from '@/components/NavBar';
config.autoAddCss = false;

export default ({ children }: { children: ReactNode }): ReactNode => {
  return (
    <html className='flex flex-col min-h-screen bg-gray-900 dark:text-white [&_li]:ml-4'>
      <body className='flex flex-col min-h-screen'>
        <NavBar />
        {children}
      </body>
    </html>
  );
};
