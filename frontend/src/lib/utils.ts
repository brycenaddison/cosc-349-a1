import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge classes with tailwind-merge with clsx full feature. */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

/** Format time duration (s) to human-readable format. */
export const formatSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${+remainder < 10 ? '0' : ''}${remainder}`;
};

/** Format time duration (ms) to a human-readable format. */
export const formatTimestamp = (milliseconds: number): string => {
  return formatSeconds(Math.floor(milliseconds / 1000));
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

/**
 * Gets the URL for a CDragon asset on a given path.
 *
 * @param patch The patch to look for assets in, latest if undefined
 * @param path An extra path to append to the URL
 * @returns The URL of the asset path
 */
export const getAssetPath = (patch?: string, path = ''): string =>
  `https://raw.communitydragon.org/${patch ?? 'latest'}/plugins/rcp-be-lol-game-data/global/default/${path}`;

/**
 * Gets the URL for a DDragon asset on a given path.
 *
 * @param patch The patch to look for assets in, latest if undefined
 * @param path An extra path to append to the URL
 * @returns The URL of the asset path
 */
export const getDataPath = (patch?: string, path = ''): string =>
  `http://ddragon.leagueoflegends.com/cdn/${patch ?? process.env.LIVE_PATCH ?? '14.3'}.1/data/en_US/${path}`;

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

/** A list of popular operating systems. */
export type OS = 'Mac OS' | 'iOS' | 'Windows' | 'Android' | 'Linux' | undefined;

/** Get the current operating system of the user. */
export const getOS = (): OS => {
  if (typeof window === 'undefined') return undefined;

  const userAgent = window.navigator.userAgent;

  let os: OS;

  if (userAgent.includes('Mac')) {
    os = 'Mac OS';
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    os = 'iOS';
  } else if (userAgent.includes('Win')) {
    os = 'Windows';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  }

  return os;
};

/** Get the command key of the operating system. */
export const getCommandKey = (): string => {
  const os = getOS();
  if (os === 'Mac OS' || os === 'iOS') {
    return '⌘';
  }
  return 'Ctrl';
};
