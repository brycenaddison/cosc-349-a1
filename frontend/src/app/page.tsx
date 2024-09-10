import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { H1 } from '@/components/ui/H1';

export default function HomePage(): JSX.Element {
  return (
    <div className='flex flex-col items-center justify-center grow gap-2'>
      <H1>Welcome to Stats.</H1>
      <Button asChild>
        <Link href={`/history/`}>Go to match history</Link>
      </Button>
    </div>
  );
}
