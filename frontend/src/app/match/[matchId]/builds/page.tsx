import { notFound } from 'next/navigation';
import { BuildPage } from './components/BuildPage';
import { getMatch, getTimeline } from '@/lib/match';

export default async function Page({
  params,
}: {
  params: { matchId: string };
}): Promise<JSX.Element> {
  const matchPromise = getMatch(params.matchId);
  const timelinePromise = getTimeline(params.matchId);

  const [match, timeline] = await Promise.all([matchPromise, timelinePromise]);

  if (!match || !timeline) return notFound();

  return <BuildPage match={match} timeline={timeline} />;
}
