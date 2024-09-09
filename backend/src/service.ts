import pg from './pg';
import {
  type Comment,
  type Match,
  type ParsedComment,
  type RiotMatch,
  type RiotTimeline,
} from './types';

export const getMatch = async (id: string): Promise<RiotMatch> => {
  const res = await pg.query('select data from match where id = $1', [id]);

  return res.rows[0] as RiotMatch;
};

export const getTimeline = async (id: string): Promise<RiotTimeline> => {
  const res = await pg.query('select data from timeline where id = $1', [id]);

  return res.rows[0] as RiotTimeline;
};

export const getMatchlist = async (): Promise<Match[]> => {
  const res = await pg.query('select * from matchlist');

  return res.rows as Match[];
};

export const getMatchesAndComments = async (): Promise<
  (Match & { comments: ParsedComment[] })[]
> => {
  const matchlist = (await getMatchlist()).map(
    (m): Match & { comments: ParsedComment[] } => ({ ...m, comments: [] }),
  );

  const commentRes = await pg.query(
    'select (match_id, name, message, time) from comment',
  );

  const comments = commentRes.rows as Comment[];

  matchlist.forEach((obj) => {
    const results = comments.filter(
      ({ match_id: matchId }) => matchId === obj.id,
    );

    obj.comments = results.map((r) => ({
      name: r.name,
      message: r.message,
      timestamp: r.time,
    }));
  });

  return matchlist;
};

export const postMessage = async (
  id: string,
  name: string,
  content: string,
): Promise<boolean> => {
  await pg.query(
    'insert into message (match_id, name, message) values ($1, $2, $3)',
    [id, name, content],
  );

  return true;
};
