import { type Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound(): JSX.Element {
  return (
    <div className='flex flex-col w-full h-screen items-center justify-center gap-2'>
      <h1 className='text-2xl'>404</h1>
      <p>Page not found</p>
      <Link href='/'>
        <button className='btn btn-primary'>Go Home</button>
      </Link>
    </div>
  );
}
