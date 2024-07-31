import Link from 'next/link';
import { exampleMatches } from '@/app/match/[matchId]/page';
import { Button } from '@/components/ui/Button';
import { H1 } from '@/components/ui/H1';

export default function HomePage(): JSX.Element {
  return (
    <div className='flex flex-col items-center justify-center grow gap-2'>
      <H1>Welcome to Stats.</H1>
      <Button asChild>
        <Link href={`/match/${exampleMatches[0]}/`}>
          Go to match history test
        </Link>
      </Button>
    </div>
  );
}
