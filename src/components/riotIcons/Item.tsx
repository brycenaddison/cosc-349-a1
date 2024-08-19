import Image from 'next/image';
import {
  PlaceholderIcon,
  getIconClass,
} from '@/components/riotIcons/PlaceholderIcon';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn, getAssetPath, getDataPath } from '@/lib/utils';

/** A link to the CDragon item lookup JSON (for item details). */
export const itemListPath = 'v1/items.json';

/** A path to the item icon directory. */
const itemPath = 'assets/items/icons2d/';

/** Props for {@link GenericItem}. */
export type GenericItemProps = ItemProps & {
  /** The CDragon Item json. */
  itemLookup?: CDragon.Item[];
  /** The DDragon Item json. */
  tooltipLookup?: Riot.DDragon.ItemLookup;
};

/** A wrapped icon representing an item. */
export const GenericItem = ({
  item: itemId = 0,
  size = 'md',
  className = '',
  itemLookup,
  tooltipLookup,
  patch,
}: GenericItemProps): JSX.Element => {
  const item = itemLookup?.find((item) => item.id === itemId);

  const itemDetails = tooltipLookup?.data[itemId.toString()];

  if (item === undefined) {
    return <PlaceholderIcon size={size} className={className} />;
  }

  const iconClass = cn(className, getIconClass(size));

  const path = item.iconPath.slice(item.iconPath.lastIndexOf('/') + 1);

  const sizePx = size === 'sm' ? 24 : size === 'md' ? 32 : 48;

  const name = itemDetails ? itemDetails.name : item.name;

  const description = (itemDetails ? itemDetails.description : item.description)
    .replaceAll(/<br>(<br>)+/g, '<br><br>')
    .replaceAll('<attention', '<attention style="font-weight: bold;"')
    .replaceAll('<status', '<status style="color: rgb(156, 39, 176);"')
    .replaceAll('keywordStealth', 'keyword')
    .replaceAll('<keyword>', '<keyword style="color: rgb(156, 39, 176);">')
    .replaceAll('<passive', '<passive style="color: white; font-weight: bold;"')
    .replaceAll(
      '<active',
      '<active style="color: rgb(255, 245, 157); font-weight: bold;"',
    )
    .replaceAll(
      '<scaleMana',
      '<scaleMana style="color: lightblue; font-weight: bold;"',
    )
    .replaceAll(
      '<shield',
      '<shield style="color: lightblue; font-weight: bold;"',
    );

  const price = itemDetails
    ? `${itemDetails.gold.total} (${itemDetails.gold.sell})`
    : item.priceTotal;

  return (
    <Tooltip
      tooltip={
        <div className='flex flex-col font-normal text-left text-gray-700 dark:text-gray-300'>
          <div className='font-bold dark:text-blue-200 text-blue-700'>
            {name}
          </div>
          <div
            dangerouslySetInnerHTML={{
              // todo: make a proper parser, or eventually our own labels
              // note that this is actually dangerous since content is from cdragon
              __html: description
                .replaceAll(
                  '<attention',
                  '<attention style="font-weight: bold;"',
                )
                .replaceAll(
                  '<status',
                  '<status style="color: rgb(156, 39, 176);"',
                )
                .replaceAll(
                  '<keyword',
                  '<keyword style="color: rgb(156, 39, 176);"',
                )
                .replaceAll(
                  '<passive',
                  '<passive style="color: inherit; font-weight: bold;"',
                )
                .replaceAll(
                  '<active',
                  '<active style="color: rgb(255, 245, 157); font-weight: bold;"',
                )
                .replaceAll(
                  '<scaleMana',
                  '<scaleMana style="color: lightblue; font-weight: bold;"',
                )
                .replaceAll(
                  '<shield',
                  '<shield style="color: lightblue; font-weight: bold;"',
                ),
            }}
          />
          <div className='mt-2'>
            Cost: <span className='text-yellow-400'>{price}</span>
          </div>
        </div>
      }
    >
      <Image
        priority
        className={iconClass}
        src={`${getAssetPath(patch, itemPath)}${path.toLowerCase()}`}
        height={sizePx}
        width={sizePx}
        alt={`Item ${item.name}`}
      />
    </Tooltip>
  );
};

/** Props for {@link Item}. */
export type ItemProps = {
  /** The item number, blank if undefined. */
  item?: number;
  /** The icon size (24, 32, or 48px). */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes to apply to the icon wrapper. */
  className?: string;
  /** The patch of the game. */
  patch?: string;
};

/** A server-side rendered and wrapped icon of an item. */
export const Item = async ({
  item: itemId = 0,
  size = 'md',
  className = '',
  patch,
}: ItemProps): Promise<JSX.Element | null> => {
  const itemLookup = (await fetch(getAssetPath(patch, itemListPath)).then(
    (res) => res.json(),
  )) as CDragon.Item[];

  const tooltipLookup = (await fetch(getDataPath(patch, 'item.json')).then(
    (res) => res.json(),
  )) as Riot.DDragon.ItemLookup;

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
