import { BuildPage } from './components/BuildPage';
import { getMatch, getTimeline } from '@/lib/match';

export default async function Page({
  params,
}: {
  params: { matchId: string };
}): Promise<JSX.Element> {
  const matchPromise = getMatch(`NA1_${params.matchId}`);
  const timelinePromise = getTimeline(`NA1_${params.matchId}`);

  const [match, timeline] = await Promise.all([matchPromise, timelinePromise]);

  return <BuildPage match={match} timeline={timeline} />;
}
