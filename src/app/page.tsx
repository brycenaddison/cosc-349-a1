import Link from 'next/link';
import { EXAMPLE_MATCHES } from '@/app/match/[matchId]/page';
import { H1 } from '@/components/H1';

export default function HomePage(): JSX.Element {
  return (
    <div className='flex flex-col items-center justify-center grow gap-2'>
      <H1>Welcome to Stats.</H1>
      <Link href={`/match/${EXAMPLE_MATCHES[0]}/`}>
        <button className='btn btn-primary'>Go to match history test</button>
      </Link>
    </div>
  );
}
