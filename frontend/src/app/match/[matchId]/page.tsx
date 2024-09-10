import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Scoreboard } from './components/Scoreboard';
import { StatTable } from '@/app/match/[matchId]/components/StatTable';
import { getMatch, getMatchParticipants, getTimeline } from '@/lib/match';
import { formatSeconds, getPatch } from '@/lib/utils';

export default async function Page({
  params,
}: {
  params: { matchId: string };
}): Promise<JSX.Element> {
  const matchPromise = getMatch(params.matchId);
  const timelinePromise = getTimeline(params.matchId);

  const [match, timeline] = await Promise.all([matchPromise, timelinePromise]);

  if (!match || !timeline) notFound();

  const players = await getMatchParticipants(match);

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
