import { format } from 'date-fns';
import { Scoreboard } from './components/Scoreboard';
import { Wrapper } from './components/Wrapper';
import { getMatch } from '@/lib/match';
import { formatSeconds, getPatch } from '@/lib/utils';

export const exampleMatches = ['4947148802', '4959299173'];

export function generateStaticParams(): { matchId: string }[] {
  return exampleMatches.map((matchId) => ({ matchId }));
}

export default async function Page({
  params,
}: {
  params: { matchId: string };
}): Promise<JSX.Element> {
  const data = await getMatch(`NA1_${params.matchId}`);

  return (
    <Wrapper page='scoreboard' matchId={params.matchId}>
      <div className='flex flex-col p-4 pt-0 mx-auto'>
        <div className='flex gap-2'>
          {format(data.info.gameStartTimestamp, 'M/d/yyyy')}
          <div className='text-gray-600'>·</div>
          {formatSeconds(data.info.gameDuration)}
          <div className='text-gray-600'>·</div>
          Patch {getPatch(data)}
          <div className='text-gray-600'>·</div>
          Game ID: {params.matchId}
        </div>
        <div className='hidden lg:flex 2xl:hidden'>
          <Scoreboard matchData={data} size='md' />
        </div>
        <div className='hidden 2xl:flex'>
          <Scoreboard matchData={data} size='lg' />
        </div>
        <div className='flex lg:hidden'>
          <Scoreboard matchData={data} size='sm' />
        </div>
      </div>
    </Wrapper>
  );
}

// 404 for matches not in data
export const dynamic = 'force-static';
export const dynamicParams = false;
