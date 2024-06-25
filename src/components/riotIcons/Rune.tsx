import Image from 'next/image';
import { Tooltip } from '@/components/Tooltip';
import { cn } from '@/lib/utils';

const CDRAGON_URL =
  'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/';
const RUNES_REFORGED =
  'http://ddragon.leagueoflegends.com/cdn/14.3.1/data/en_US/runesReforged.json';

export type RuneProps = {
  runeData: Riot.MatchV5.Perks;
  type?: 'keystone' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const Rune = async ({
  runeData,
  type = 'keystone',
  size = 'lg',
  className = '',
}: RuneProps): Promise<JSX.Element> => {
  const runeDirectory = (await fetch(RUNES_REFORGED).then((res) =>
    res.json(),
  )) as Riot.DDragon.RuneLookup[];

  const rune = type === 'keystone' ? runeData.styles[0] : runeData.styles[1];

  const tree = runeDirectory.find((tree) => tree.id === rune.style);

  let path = 'runesicon.png';
  let alt = `${type} rune`;
  let description;

  if (tree !== undefined) {
    if (type === 'keystone') {
      const keystone = tree.slots[0].runes.find(
        (rune) => rune.id === runeData.styles[0].selections[0].perk,
      );

      if (keystone !== undefined) {
        path = keystone.icon;
        alt = keystone.name;
        description = keystone.longDesc;
      }
    } else {
      path = tree.icon;
      alt = tree.name;
    }
  }

  const src = `${CDRAGON_URL}${path.toLowerCase()}`;

  const sizePx = size === 'sm' ? 13 : size === 'md' ? 20 : 26;

  const img = (
    <Image
      src={src}
      className={cn(className, 'bg-white/5 shadow-tile', {
        'rounded-lg': size === 'lg',
        'rounded-md': size === 'md',
        rounded: size === 'sm',
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
        <div className='flex flex-col font-normal text-gray-300'>
          <div className='font-bold text-green-200'>{alt}</div>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      }
    >
      {img}
    </Tooltip>
  );
};
