import { notFound } from 'next/navigation';
import { OverviewDashboard } from './components/OverviewDashboard';
import { getMatch, getMatchParticipants, getTimeline } from '@/lib/match';

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

  return <OverviewDashboard timeline={timeline} players={players} />;
}
