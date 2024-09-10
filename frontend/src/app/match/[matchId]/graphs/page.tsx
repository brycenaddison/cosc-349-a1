import { notFound } from 'next/navigation';
import { BarChart } from './components/BarChart';
import { getMatch, getMatchParticipants } from '@/lib/match';

export default async function Page({
  params,
}: {
  params: { matchId: string };
}): Promise<JSX.Element> {
  const match = await getMatch(params.matchId);

  if (!match) notFound();

  const players = await getMatchParticipants(match);

  return <BarChart match={match} players={players} />;
}
