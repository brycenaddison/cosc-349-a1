import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import morgan from 'morgan';
import {
  getMatch,
  getMatchesAndComments,
  getMatchlist,
  getTimeline,
  postMessage,
} from './service';

export const createServer = (): Express => {
  const app = express();
  app
    .disable('x-powered-by')
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get('/match/:id', async (req, res) => {
      const matches = await getMatchlist();

      const matchMeta = matches.find((match) => match.id === req.params.id);

      if (!matchMeta) {
        return res.status(404).send('Match not found');
      }

      getMatch(req.params.id)
        .then(({ data }) => res.status(200).json(data))
        .catch((reason: unknown) => {
          console.error(reason);
          res.status(500).send('Unknown backend error');
        });
    })
    .get('/timeline/:id', async (req, res) => {
      const matches = await getMatchlist();

      const matchMeta = matches.find((match) => match.id === req.params.id);

      if (!matchMeta) {
        return res.status(404).send('Match not found');
      }

      getTimeline(req.params.id)
        .then(({ data }) => res.status(200).json(data))
        .catch((reason: unknown) => {
          console.error(reason);
          res.status(500).send('Unknown backend error');
        });
    })
    .get('/matchlist', (_, res) => {
      getMatchesAndComments()
        .then((list) => res.status(200).json(list))
        .catch((reason: unknown) => {
          console.error(reason);
          res.status(500).send('Unknown backend error');
        });
    })
    .post<unknown, unknown, { matchId: string; name: string; message: string }>(
      '/comment',
      (req, res) => {
        const { matchId, name, message } = req.body;

        postMessage(matchId, name, message)
          .then(() => res.status(200).json({ ok: true }))
          .catch((reason: unknown) => {
            console.error(reason);
            res.status(500).send('Unknown backend error');
          });
      },
    )
    .get('/status', (_, res) => {
      return res.status(200).json({ ok: true });
    });

  return app;
};
