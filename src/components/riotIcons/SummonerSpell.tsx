import Image from 'next/image';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';

// There's a file for this but whatever
const SUMMONER_SPELLS: Record<
  number,
  {
    img: string;
    name: string;
  }
> = {
  21: {
    img: 'summonerbarrier.png',
    name: 'Barrier',
  },
  1: {
    img: 'summoner_boost.png',
    name: 'Cleanse',
  },
  2202: {
    img: 'summoner_flash.png',
    name: 'Flash',
  },
  2201: {
    img: 'icon_summonerspell_flee.2v2_mode_fighters',
    name: 'Flee',
  },
  14: {
    img: 'summonerignite.png',
    name: 'Ignite',
  },
  3: {
    img: 'summoner_exhaust.png',
    name: 'Exhaust',
  },
  4: {
    img: 'summoner_flash.png',
    name: 'Flash',
  },
  6: {
    img: 'summoner_haste.png',
    name: 'Ghost',
  },
  7: {
    img: 'summoner_heal.png',
    name: 'Heal',
  },
  13: {
    img: 'summonermana.png',
    name: 'Clarity',
  },
  30: {
    img: 'benevolence_of_king_poro_icon.png',
    name: 'To the King!',
  },
  31: {
    img: 'trailblazer_poro_icon.png',
    name: 'Poro Toss',
  },
  11: {
    img: 'summoner_smite.png',
    name: 'Smite',
  },
  39: {
    img: 'summoner_mark.png',
    name: 'Mark',
  },
  32: {
    img: 'summoner_mark.png',
    name: 'Mark',
  },
  12: {
    img: 'summoner_teleport.png',
    name: 'Teleport',
  },
  54: {
    img: 'summoner_empty.png',
    name: 'Placeholder',
  },
  55: {
    img: 'summoner_emptysmite.png',
    name: 'Placeholder and Attack-Smite',
  },
};

const CDRAGON_SPELLS =
  'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/data/spells/icons2d/';
const SPELLS_JSON =
  'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/summoner-spells.json';

export type SummonerSpellProps = {
  spellId?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export const SummonerSpell = async ({
  spellId = 54,
  size = 'lg',
  className = '',
}: SummonerSpellProps): Promise<JSX.Element> => {
  const spell =
    spellId in SUMMONER_SPELLS ? SUMMONER_SPELLS[spellId] : SUMMONER_SPELLS[54];
  const imgSize = size === 'lg' ? 26 : size === 'md' ? 20 : 13;

  const spells = (await fetch(SPELLS_JSON).then((res) =>
    res.json(),
  )) as CDragon.SummonerSpell[];

  const spellData = spells.find((spell) => spell.id === spellId);

  return (
    <Tooltip
      tooltip={
        <div className='flex flex-col font-normal text-left text-gray-700 dark:text-gray-300'>
          <div className='font-bold dark:text-yellow-400 text-yellow-500'>
            {spell.name}
          </div>
          <div>{spellData?.description}</div>
        </div>
      }
    >
      <Image
        className={cn(className, 'shadow-tile', {
          'rounded-md': size === 'lg',
          rounded: size === 'md',
          'rounded-sm': size === 'sm',
        })}
        src={`${CDRAGON_SPELLS}${spell.img}`}
        alt={spell.name}
        width={imgSize}
        height={imgSize}
      />
    </Tooltip>
  );
};
