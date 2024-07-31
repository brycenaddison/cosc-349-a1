const handleResponse = async (response: Response): Promise<unknown> => {
  if (!response.ok) {
    await response
      .json()
      .then((data: { status: { message: string; status_code: number } }) => {
        throw new Error(`${data.status.status_code}: ${data.status.message}`);
      });
  }
  return response.json();
};

const get = async (url: string): Promise<unknown> =>
  fetch(url).then(handleResponse);

export const getTimeline = async (
  matchId: string,
): Promise<Riot.MatchV5.Timeline> =>
  get(
    `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}/timeline?api_key=${process.env.RIOT_TOKEN}`,
  ) as Promise<Riot.MatchV5.Timeline>;

export const getMatch = async (matchId: string): Promise<Riot.MatchV5.Match> =>
  get(
    `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${process.env.RIOT_TOKEN}`,
  ) as Promise<Riot.MatchV5.Match>;

export const getRecentMatches = async (puuid: string): Promise<string[]> =>
  get(
    `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${process.env.RIOT_TOKEN}`,
  ) as Promise<string[]>;

export type MatchParticipant = {
  displayName: string;
  puuid: string;
  championId: number;
  participantId: number;
  teamId: 100 | 200;
  // todo: add more stuff from player/team backend
};

export type Participants = Record<number, MatchParticipant>;

export const getMatchParticipants = (
  match: Riot.MatchV5.Match,
): Record<number, MatchParticipant> => {
  const entries: [number, MatchParticipant][] = match.info.participants.map(
    (participant) => {
      return [
        participant.participantId,
        {
          displayName: participant.summonerName,
          puuid: participant.puuid,
          championId: participant.championId,
          participantId: participant.participantId,
          teamId: participant.teamId,
        },
      ];
    },
  );

  return Object.fromEntries(entries);
};
