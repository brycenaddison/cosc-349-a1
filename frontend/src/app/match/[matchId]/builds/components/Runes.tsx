'use client';

import { ClientRune } from '@/components/riotIcons/client/ClientRune';

export type RunesProps = {
  runes: Riot.MatchV5.Perks;
  patch: string;
};

export const Runes = ({ runes, patch }: RunesProps): JSX.Element => (
  <div className='flex gap-2 items-center'>
    {([0, 1, 2, 3] as const).map((slot) => (
      <ClientRune
        key={`primary${slot}`}
        runeData={runes}
        type='primary'
        slot={slot}
        size={slot === 0 ? 'lg' : 'md'}
        patch={patch}
      />
    ))}
    <ClientRune
      className='p-0.5 ml-2'
      key='secondaryTree'
      runeData={runes}
      type='secondary'
      size='md'
      patch={patch}
    />
    {([0, 1] as const).map((slot) => (
      <ClientRune
        key={`secondary${slot}`}
        runeData={runes}
        type='secondary'
        slot={slot}
        size='md'
        patch={patch}
      />
    ))}
    <div />
    {([1, 2, 3] as const).map((slot) => (
      <ClientRune
        key={`stat${slot}`}
        runeData={runes}
        type='stat'
        slot={slot}
        size='md'
        patch={patch}
      />
    ))}
  </div>
);
