import { format } from 'date-fns';
import { Scoreboard } from './components/Scoreboard';
import { StatTable } from '@/app/match/[matchId]/components/StatTable';
import { exampleMatches } from '@/config/config';
import { getMatch, getMatchParticipants, getTimeline } from '@/lib/match';
import { formatSeconds, getPatch } from '@/lib/utils';

export function generateStaticParams(): { matchId: string }[] {
  return exampleMatches.map((matchId) => ({ matchId }));
}

export default async function Page({
  params,
}: {
  params: { matchId: string };
}): Promise<JSX.Element> {
  const matchPromise = getMatch(`NA1_${params.matchId}`);
  const timelinePromise = getTimeline(`NA1_${params.matchId}`);

  const [match, timeline] = await Promise.all([matchPromise, timelinePromise]);

  const players = getMatchParticipants(match);

  return (
    <div className='flex flex-col p-4 mx-auto'>
      <div className='flex gap-2'>
        {format(match.info.gameStartTimestamp, 'M/d/yyyy')}
        <div className='text-gray-600'>·</div>
        {formatSeconds(match.info.gameDuration)}
        <div className='text-gray-600'>·</div>
        Patch {getPatch(match)}
        <div className='text-gray-600'>·</div>
        Game ID: {params.matchId}
      </div>
      <div className='hidden lg:flex 2xl:hidden'>
        <Scoreboard matchData={match} size='md' />
      </div>
      <div className='hidden 2xl:flex'>
        <Scoreboard matchData={match} size='lg' />
      </div>
      <div className='flex lg:hidden'>
        <Scoreboard matchData={match} size='sm' />
      </div>
      <div className='h-8' />
      <StatTable match={match} players={players} timeline={timeline} />
    </div>
  );
}

// 404 for matches not in data
export const dynamic = 'force-static';
export const dynamicParams = false;
