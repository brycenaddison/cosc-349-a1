'use client';
import { type Metadata } from 'next';
import Link from 'next/link';
import { useEffect } from 'react';
import { CommandMenu } from '@/components/CommandMenu';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Error',
};

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex flex-col w-full grow items-center justify-center gap-6'>
      <div className='text-3xl'>
        <span className='font-bold'>500</span> | Server Error
      </div>
      <p>Try again later, or contact an admin if this continues to happen.</p>
      <Button asChild>
        <Link href='/'>Go Home</Link>
      </Button>
      <div className='relative h-96 w-96'>
        <div className='absolute left-0 right-0'>
          <CommandMenu noButton />
        </div>
      </div>
    </div>
  );
}
