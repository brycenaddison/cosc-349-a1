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

export const getTimeline = async (
  matchId: string,
): Promise<Riot.MatchV5.Timeline> =>
  fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}/timeline?api_key=${process.env.RIOT_TOKEN}`,
  ).then(handleResponse) as Promise<Riot.MatchV5.Timeline>;

export const getMatch = async (matchId: string): Promise<Riot.MatchV5.Match> =>
  fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${process.env.RIOT_TOKEN}`,
  ).then(handleResponse) as Promise<Riot.MatchV5.Match>;

export const getRecentMatches = async (puuid: string): Promise<string[]> =>
  fetch(
    `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${process.env.RIOT_TOKEN}`,
  ).then(handleResponse) as Promise<string[]>;
