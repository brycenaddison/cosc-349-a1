import { Wrapper } from '../components/Wrapper';
import { OverviewDashboard } from './components/OverviewDashboard';
import { getMatch, getMatchParticipants, getTimeline } from '@/lib/match';

export default async function Page({
  params,
}: {
  params: { matchId: string };
}): Promise<JSX.Element> {
  const match = await getMatch(`NA1_${params.matchId}`);
  const timeline = await getTimeline(`NA1_${params.matchId}`);
  const players = getMatchParticipants(match);

  return (
    <Wrapper page='overview' matchId={params.matchId}>
      <OverviewDashboard timeline={timeline} players={players} />
    </Wrapper>
  );
}
