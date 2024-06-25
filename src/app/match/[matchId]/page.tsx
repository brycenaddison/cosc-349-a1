import { format } from 'date-fns';
import { Scoreboard } from '@/app/match/[matchId]/components/Scoreboard';
import { Wrapper } from '@/app/match/[matchId]/components/Wrapper';
import { getMatch } from '@/lib/match';
import { formatSeconds, getPatch } from '@/lib/utils';

export const EXAMPLE_MATCHES = ['4959299173'];

export function generateStaticParams(): { matchId: string }[] {
  return EXAMPLE_MATCHES.map((matchId) => ({ matchId }));
}

export default async function Page({
  params,
}: {
  params: { matchId: string };
}): Promise<JSX.Element> {
  const data = await getMatch(`NA1_${params.matchId}`);

  return (
    <Wrapper page='scoreboard' matchId={params.matchId}>
      <div className='flex flex-col p-4 items-center'>
        <div className='flex gap-2'>
          {format(data.info.gameStartTimestamp, 'M/d/yyyy')}
          <div className='text-gray-600'>·</div>
          {formatSeconds(data.info.gameDuration)}
          <div className='text-gray-600'>·</div>
          Patch {getPatch(data)}
          <div className='text-gray-600'>·</div>
          Game ID: {params.matchId}
        </div>
        <Scoreboard matchData={data} size='lg' />
      </div>
    </Wrapper>
  );
}

// 404 for matches not in data
export const dynamic = 'force-static';
export const dynamicParams = false;
