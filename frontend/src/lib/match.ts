'use server';

import { type RequestInit } from 'next/dist/server/web/spec-extension/request';

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
const get = async (url: string, options?: RequestInit): Promise<unknown> =>
  fetch(url, options).then(handleResponse);

/** Fetches timeline data. */
export const getTimeline = async (
  matchId: string,
): Promise<Riot.MatchV5.Timeline | undefined> =>
  get(`${process.env.NEXT_PUBLIC_API_HOST}/timeline/${matchId}`) as Promise<
    Riot.MatchV5.Timeline | undefined
  >;

/** Fetches match data. */
export const getMatch = async (
  matchId: string,
): Promise<Riot.MatchV5.Match | undefined> =>
  get(`${process.env.NEXT_PUBLIC_API_HOST}/match/${matchId}`) as Promise<
    Riot.MatchV5.Match | undefined
  >;

/** Represents a comment on a match. */
export type Comment = {
  /** The name of the poster. */
  name: string;
  /** The time the message was posted. */
  timestamp: number;
  /** The content of the message. */
  message: string;
};

/** Represents an entry in the match list. */
export type MatchListing = {
  /** The Riot match id. */
  id: string;
  /** The list of comments on the match. */
  comments: Comment[];
};

/** Gets the full list of match ids and comments. */
export const getHistory = async (): Promise<MatchListing[] | undefined> =>
  get(`${process.env.NEXT_PUBLIC_API_HOST}/matchlist`, {
    next: { revalidate: 0 },
  }) as Promise<MatchListing[] | undefined>;

/** Posts a comment on a match. */
export const postComment = async (
  matchId: string,
  name: string,
  message: string,
): Promise<{ matchId: string } & Comment> =>
  get(`${process.env.NEXT_PUBLIC_API_HOST}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      matchId,
      name,
      message,
    }),
  }) as Promise<{ matchId: string } & Comment>;

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
export const getMatchParticipants = async (
  match: Riot.MatchV5.Match,
): Promise<Record<number, MatchParticipant>> => {
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

  return new Promise((resolve) => {
    resolve(Object.fromEntries(entries));
  });
};
