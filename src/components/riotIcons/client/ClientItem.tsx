'use client';

import useSWR from 'swr';
import {
  GenericItem,
  type ItemProps,
  getCDragonItems,
  getDDragonItems,
} from '@/components/riotIcons/Item';

export const ClientItem = ({
  item: itemId = 0,
  size = 'md',
  className = '',
  patch,
}: ItemProps): JSX.Element => {
  const { data: itemLookup } = useSWR('items', () =>
    fetch(getCDragonItems(patch)).then(
      (res): Promise<CDragon.Item[]> => res.json(),
    ),
  );

  const { data: tooltipLookup } = useSWR(
    'riotItems',
    (): Promise<Riot.DDragon.ItemLookup> =>
      fetch(getDDragonItems(patch)).then((res) => res.json()),
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
