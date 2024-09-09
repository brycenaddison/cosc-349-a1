'use client';

import useSWR from 'swr';
import {
  GenericRune,
  type RuneProps,
  cdragonPerksList,
  ddragonPerksList,
} from '../Rune';
import { getAssetPath, getDataPath } from '@/lib/utils';

/** A client-side wrapper for a rune icon. */
export const ClientRune = ({ patch, ...args }: RuneProps): JSX.Element => {
  const { data: riot } = useSWR('riotPerks', () =>
    fetch(getDataPath(patch, ddragonPerksList)).then(
      (res): Promise<Riot.DDragon.RuneLookup[]> => res.json(),
    ),
  );

  const { data: cdragon } = useSWR(
    'cdragonPerks',
    (): Promise<CDragon.Perk[]> =>
      fetch(getAssetPath(patch, cdragonPerksList)).then((res) => res.json()),
  );

  return (
    <GenericRune
      {...args}
      patch={patch}
      riotPerks={riot}
      cdragonPerks={cdragon}
    />
  );
};
