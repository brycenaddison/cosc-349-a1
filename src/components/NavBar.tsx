import Link from 'next/link';
import { H1 } from '@/components/H1';

export const NavBar = (): JSX.Element => (
  <div className='p-4 w-full items-center flex h-16 border-b border-gray-800'>
    <Link href='/'>
      <H1 className='hover:text-gray-200 transition duration-200'>Stats</H1>
    </Link>
  </div>
);
