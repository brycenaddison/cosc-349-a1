/**
 * Generic error handler for HTTP requests.
 * @param response HTTP response from API
 * @returns JSON data of response
 */
const handleResponse = async (response: Response): Promise<unknown> => {
  if (!response.ok) {
    if (response.status === 404) return undefined;

    throw new Error(response.statusText);
  }
  return response.json();
};

/** Fetches JSON data from URL. */
const get = async (url: string): Promise<unknown> =>
  fetch(url).then(handleResponse);

/** Fetches timeline data. */
export const getTimeline = async (
  matchId: string,
): Promise<Riot.MatchV5.Timeline | undefined> =>
  get(`${process.env.API_HOST}/timeline/${matchId}`) as Promise<
    Riot.MatchV5.Timeline | undefined
  >;

/** Fetches match data. */
export const getMatch = async (
  matchId: string,
): Promise<Riot.MatchV5.Match | undefined> =>
  get(`${process.env.API_HOST}/match/${matchId}`) as Promise<
    Riot.MatchV5.Match | undefined
  >;

/** Represents a player in a match. */
export type MatchParticipant = {
  /** The player's chosen display name. */
  displayName: string;
  /** The players Riot UUID. */
  puuid: string;
  /** The player's selected numeric champion id. */
  championId: number;
  /** The participant id of the player in the match. */
  participantId: number;
  /** Which team the player was on. */
  teamId: 100 | 200;
  // todo: add more stuff from player/team backend
};

/** A map of participant ids to {@link MatchParticipant} objects. */
export type Participants = Record<number, MatchParticipant>;

/**
 * Gets a map of participant ids to participants.
 *
 * TODO: Once the players have data in our database, this will be a network
 * call.
 */
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

/** Returns the participant data of the participant's lane opponent. */
export const getLaneOpponent = (
  participantId: number,
  match: Riot.MatchV5.Match,
): Riot.MatchV5.Participant => {
  const { teamPosition, teamId } =
    match.info.participants.find((p) => p.participantId === participantId) ??
    match.info.participants[0];

  const opponentTeamId = teamId === 100 ? 200 : 100;
  const opponent = match.info.participants.find(
    (p) => p.teamId === opponentTeamId && p.teamPosition === teamPosition,
  );

  if (opponent === undefined) {
    return (
      match.info.participants.find(
        (p) => p.participantId === participantId + (teamId === 100 ? 5 : -5),
      ) ?? match.info.participants[0]
    );
  }

  return opponent;
};
