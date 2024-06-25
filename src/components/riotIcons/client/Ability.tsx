'use client';

import Image from 'next/image';
import { Tooltip } from '@/components/Tooltip';
import { PlaceholderIcon } from '@/components/riotIcons/PlaceholderIcon';
import { useChampionDetails } from '@/lib/hooks';
import { cn, getSpellUrl } from '@/lib/utils';

export type AbilityProps = {
  championId: number;
  ability: number;
  patch: string;
  size?: 'sm' | 'md' | 'lg';
};

export const Ability = ({
  championId,
  ability,
  patch,
  size = 'md',
}: AbilityProps): JSX.Element => {
  const { data: champion } = useChampionDetails(championId, patch);

  if (!champion) {
    return <PlaceholderIcon size={size} />;
  }

  const spellKey = ['Q', 'W', 'E', 'R'][ability - 1];

  const spell = champion.spells[ability - 1];
  const spellUrl = getSpellUrl(champion, ability, patch);

  return (
    <Tooltip
      tooltip={
        <div className='flex flex-col font-normal text-gray-300'>
          <div className='font-bold text-yellow-200'>{spell.name}</div>
          {spell.description}
        </div>
      }
    >
      <div
        className={cn('relative overflow-hidden rounded-lg shadow-tile', {
          'w-8 h-8': size === 'sm',
          'w-12 h-12': size === 'md',
          'w-16 h-16': size === 'lg',
        })}
      >
        <Image
          src={spellUrl}
          width={360}
          height={360}
          alt={spell.name}
          priority
          className='object-center'
        />
        <div className='absolute bottom-0 px-0.5 w-4 h-4 right-0 font-bold bg-gray-800/50 rounded-tl-lg rounded-br-lg text-xs'>
          {spellKey}
        </div>
      </div>
    </Tooltip>
  );
};
