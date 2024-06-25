import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge classes with tailwind-merge with clsx full feature. */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

/** Format time duration (s) to human-readable format. */
export const formatSeconds = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${+seconds < 10 ? '0' : ''}${seconds}`;
};

/** Fetcher function for useSWR. */
export const fetcher = (
  ...args: Parameters<typeof fetch>
): Promise<unknown> => {
  return fetch(...args).then((res) => res.json());
};

/** Get patch from match data. */
export const getPatch = (data: Riot.MatchV5.Match): string => {
  return data.info.gameVersion.split('.').slice(0, 2).join('.');
};

/** Get champion details from ID. */
export const getChampion = async (
  championId: number,
  patch: string,
): Promise<Riot.DDragon.ChampionShort> => {
  const data = (await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${patch}.1/data/en_US/champion.json`,
  ).then((res) => res.json())) as Riot.DDragon.ChampionLookup;

  const champions = Object.values(data.data);

  let champion = champions.find(
    (champion) => parseInt(champion.key) === championId,
  );

  if (!champion) {
    console.warn(`Champion ID ${championId} not found in patch ${patch}`);
    champion = champions[0];
  }

  return champion;
};

/** Get the full champion details from ID. */
export const getChampionDetails = async (
  championId: number,
  patch?: string,
): Promise<Riot.DDragon.Champion> => {
  const fallbackPatch = patch ?? process.env.LIVE_PATCH ?? '14.4';
  const champion = await getChampion(championId, fallbackPatch);

  return fetch(
    `https://ddragon.leagueoflegends.com/cdn/${fallbackPatch}.1/data/en_US/champion/${champion.id}.json`,
  )
    .then((res) => res.json())
    .then(
      (response: Riot.DDragon.ChampionResponse) =>
        Object.values(response.data)[0],
    );
};

/** Get the full spell URL from the Riot JSON. */
export const getSpellUrl = (
  champion: Riot.DDragon.Champion,
  slot: number,
  patch: string,
): string => {
  const spell = champion.spells[slot - 1];
  return `https://ddragon.leagueoflegends.com/cdn/${patch}.1/img/spell/${spell.image.full}`;
};
