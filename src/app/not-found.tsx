import { type Metadata } from 'next';
import Link from 'next/link';
import { CommandMenu } from '@/components/CommandMenu';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Not Found',
};

export default function NotFound(): JSX.Element {
  return (
    <div className='flex flex-col grow items-center justify-center gap-6'>
      <div className='text-3xl'>
        <span className='font-bold'>404</span> | Not Found
      </div>
      <p>It looks like that page doesn't exist. Let's get you back on track.</p>
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
