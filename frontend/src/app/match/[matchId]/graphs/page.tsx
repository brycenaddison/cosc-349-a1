import { notFound } from 'next/navigation';
import { BarChart } from './components/BarChart';
import { getMatch, getMatchParticipants } from '@/lib/match';

export default async function Page({
  params,
}: {
  params: { matchId: string };
}): Promise<JSX.Element> {
  const match = await getMatch(`NA1_${params.matchId}`);

  if (!match) return notFound();

  const players = getMatchParticipants(match);

  return <BarChart match={match} players={players} />;
}
