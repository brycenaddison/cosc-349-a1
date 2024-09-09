'use client';

import useSWR from 'swr';
import {
  GenericItem,
  type ItemProps,
  itemListPath,
} from '@/components/riotIcons/Item';
import { getAssetPath, getDataPath } from '@/lib/utils';

/** A client-side wrapper for an item icon. */
export const ClientItem = ({
  item: itemId = 0,
  size = 'md',
  className = '',
  patch,
}: ItemProps): JSX.Element => {
  const { data: itemLookup } = useSWR('items', () =>
    fetch(getAssetPath(patch, itemListPath)).then(
      (res): Promise<CDragon.Item[]> => res.json(),
    ),
  );

  const { data: tooltipLookup } = useSWR(
    'riotItems',
    (): Promise<Riot.DDragon.ItemLookup> =>
      fetch(getDataPath(patch, 'item.json')).then((res) => res.json()),
  );

  return (
    <GenericItem
      item={itemId}
      size={size}
      className={className}
      itemLookup={itemLookup}
      tooltipLookup={tooltipLookup}
      patch={patch}
    />
  );
};
