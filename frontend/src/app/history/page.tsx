import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CommentArea } from './components/CommentArea';
import { getHistory } from '@/lib/match';

export default async function Page(): Promise<JSX.Element> {
  const matches = await getHistory();

  if (!matches) notFound();

  return (
    <div className='max-w-2xl flex flex-col gap-2 mx-auto mt-2 w-[100vw] min-w-96 px-4'>
      <div className='text-2xl font-bold'>Matches</div>
      {matches.length === 0 ? (
        <p>No matches found.</p>
      ) : (
        matches.map(({ id, comments }) => (
          <div
            key={id}
            className='rounded border border-b p-3 flex flex-col gap-2'
          >
            <Link
              className='text-lg font-semibold rounded hover:bg-foreground/5 p-2 justify-between flex'
              href={`/match/${id}`}
            >
              <div>{id}</div>
              <ChevronRight />
            </Link>
            <CommentArea matchId={id} comments={comments} />
          </div>
        ))
      )}
    </div>
  );
}

export const dynamic = 'force-dynamic';
