'use client';

import useSWR, { type SWRResponse } from 'swr';
import { getChampionDetails } from '@/lib/utils';

export const useChampionDetails = (
  championId: number,
  patch?: string,
): SWRResponse<Riot.DDragon.Champion> =>
  useSWR(`championDetails-${championId}`, () =>
    getChampionDetails(championId, patch),
  );
