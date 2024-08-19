import Image from 'next/image';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn, getAssetPath, getDataPath } from '@/lib/utils';

/** Directory of stat icons paths. */
export const cdragonPerksList = 'v1/perks.json';

/** Riot rune data. */
export const ddragonPerksList = 'runesReforged.json';

/** Props for {@link Rune}. */
export type RuneProps = {
  /** The rune data from the match history. */
  runeData: Riot.MatchV5.Perks;
  /**
   * Whether to fetch the primary or secondary tree.
   *
   * By default, the primary tree will be used.
   */
  type?: 'primary' | 'secondary' | 'stat';
  /** The rune slot. Shows the tree symbol if undefined. */
  slot?: 0 | 1 | 2 | 3;
  /** The size of the icon (24, 32, or 48px). */
  size?: 'sm' | 'md' | 'lg' | number;
  /** The current patch of the game. */
  patch?: string;
  /** Extra classes to apply to the image. */
  className?: string;
};

/** A rune icon without network calls. */
export const GenericRune = ({
  runeData,
  type = 'primary',
  slot,
  size = 'lg',
  patch,
  className = '',
  riotPerks,
  cdragonPerks,
}: RuneProps & {
  riotPerks?: Riot.DDragon.RuneLookup[];
  cdragonPerks?: CDragon.Perk[];
}): JSX.Element => {
  let path = 'perk-images/styles/runesicon.png';
  let alt = `Rune`;
  let description;

  if (type === 'stat') {
    const id =
      runeData.statPerks[
        slot === 1 ? 'offense' : slot === 2 ? 'flex' : 'defense'
      ];

    const rune = cdragonPerks?.find((rune) => rune.id === id);

    if (rune !== undefined) {
      path = rune.iconPath.replace('/lol-game-data/assets/v1/', '');
      alt = rune.name;
      description = rune.longDesc;
    }
  } else {
    const runeTree =
      type === 'primary' ? runeData.styles[0] : runeData.styles[1];

    const tree = riotPerks?.find((tree) => tree.id === runeTree.style);

    if (tree !== undefined) {
      if (slot === undefined) {
        path = tree.icon;
        alt = tree.name;
      } else {
        const runes = tree.slots.flatMap(({ runes }) => runes);
        const selectedRuneId = runeTree.selections[slot].perk;

        const runeData = runes.find((rune) => rune.id === selectedRuneId);

        if (runeData !== undefined) {
          path = runeData.icon;
          alt = runeData.name;
          description = runeData.longDesc;
        }
      }
    }
  }

  const src = `${getAssetPath(patch, 'v1/')}${path.toLowerCase()}`;

  const sizePx =
    typeof size === 'number'
      ? size
      : size === 'sm'
        ? 24
        : size === 'md'
          ? 32
          : 48;

  const roundedRune =
    (type === 'secondary' && slot !== undefined) ||
    (type === 'primary' && slot !== 0 && slot !== undefined);

  const img = (
    <Image
      src={src}
      className={cn(className, 'bg-foreground/10 shadow-tile', {
        'rounded-lg': size === 'lg',
        'rounded-md': size === 'md',
        rounded: size === 'sm',
        'rounded-full': roundedRune,
      })}
      alt={alt}
      width={sizePx}
      height={sizePx}
    />
  );

  if (description === undefined) return img;

  return (
    <Tooltip
      tooltip={
        <div className='flex flex-col font-normal text-left text-gray-700 dark:text-gray-300'>
          <div className='font-bold dark:text-green-200 text-green-400'>
            {alt}
          </div>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      }
    >
      {img}
    </Tooltip>
  );
};

/** A wrapped rune icon. */
export const Rune = async ({
  patch,
  ...args
}: RuneProps): Promise<JSX.Element> => {
  const runeDirectory = (await fetch(getDataPath(patch, ddragonPerksList)).then(
    (res) => res.json(),
  )) as Riot.DDragon.RuneLookup[];
  const statIconDirectory = (await fetch(
    getAssetPath(patch, cdragonPerksList),
  ).then((res) => res.json())) as CDragon.Perk[];

  return (
    <GenericRune
      {...args}
      riotPerks={runeDirectory}
      cdragonPerks={statIconDirectory}
    />
  );
};
