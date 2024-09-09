import Image from 'next/image';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn, getAssetPath } from '@/lib/utils';

const spellInfoPath = 'v1/summoner-spells.json';

/** Props for {@link SummonerSpell}. */
export type SummonerSpellProps = {
  /** The numeric ID of the summoner spell. */
  spellId?: number;
  /** The size of the icon (24, 32, or 48px). */
  size?: 'sm' | 'md' | 'lg';
  /** Additional classes to add to the image. */
  className?: string;
  /** The patch of the game. */
  patch?: string;
};

/** A wrapped icon representing a summoner spell. */
export const SummonerSpell = async ({
  spellId = 54,
  size = 'lg',
  className = '',
  patch,
}: SummonerSpellProps): Promise<JSX.Element> => {
  const imgSize = size === 'lg' ? 26 : size === 'md' ? 20 : 13;

  const spells = (await fetch(getAssetPath(patch, spellInfoPath)).then((res) =>
    res.json(),
  )) as CDragon.SummonerSpell[];

  const spell = spells.find((spell) => spell.id === spellId) ?? {
    id: 54,
    name: 'Placeholder',
    description: 'No summoner spell selected.',
    summonerLevel: 1,
    cooldown: 0,
    gameModes: [],
    iconPath: '/lol-game-data/assets/DATA/Spells/Icons2D/Summoner_Empty.png',
  };

  spell.iconPath = spell.iconPath
    .replaceAll('/lol-game-data/assets/', '')
    .toLowerCase();

  return (
    <Tooltip
      tooltip={
        <div className='flex flex-col font-normal text-left text-gray-700 dark:text-gray-300'>
          <div className='font-bold dark:text-yellow-400 text-yellow-500'>
            {spell.name}
          </div>
          <div>{spell.description}</div>
        </div>
      }
    >
      <Image
        className={cn(className, 'shadow-tile', {
          'rounded-md': size === 'lg',
          rounded: size === 'md',
          'rounded-sm': size === 'sm',
        })}
        src={getAssetPath(patch, spell.iconPath)}
        alt={spell.name}
        width={imgSize}
        height={imgSize}
      />
    </Tooltip>
  );
};
