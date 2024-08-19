import { OverviewDashboard } from './components/OverviewDashboard';
import { getMatch, getMatchParticipants, getTimeline } from '@/lib/match';

export default async function Page({
  params,
}: {
  params: { matchId: string };
}): Promise<JSX.Element> {
  const matchPromise = getMatch(`NA1_${params.matchId}`);
  const timelinePromise = getTimeline(`NA1_${params.matchId}`);

  const [match, timeline] = await Promise.all([matchPromise, timelinePromise]);

  const players = getMatchParticipants(match);

  return <OverviewDashboard timeline={timeline} players={players} />;
}
