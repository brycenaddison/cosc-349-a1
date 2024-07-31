import { Wrapper } from '../components/Wrapper';
import { Selector } from './components/Selector';
import { getMatch, getTimeline } from '@/lib/match';

export default async function Page({
  params,
}: {
  params: { matchId: string };
}): Promise<JSX.Element> {
  const match = await getMatch(`NA1_${params.matchId}`);
  const timeline = await getTimeline(`NA1_${params.matchId}`);

  return (
    <Wrapper page='builds' matchId={params.matchId}>
      <Selector match={match} timeline={timeline} />
    </Wrapper>
  );
}
