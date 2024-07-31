'use client';

import { useState } from 'react';
import { BuildPath } from './BuildPath';
import { SkillOrder } from './SkillOrder';
import { ChampIcon } from '@/components/riotIcons/ChampIcon';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { getItemBuilds, getSkillOrders } from '@/lib/timeline';
import { cn, getPatch } from '@/lib/utils';

/** Props for {@link Selector}. */
export type SelectorProps = {
  /** Riot match data. */
  match: Riot.MatchV5.Match;
  /** Riot timeline data. */
  timeline: Riot.MatchV5.Timeline;
};

/** The client side build path page. */
export const Selector = ({ match, timeline }: SelectorProps): JSX.Element => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const participant = match.info.participants[selectedIndex];

  const { puuid: selected } = participant;

  const patch = getPatch(match);
  const builds = getItemBuilds(timeline);
  const skillOrders = getSkillOrders(timeline);

  return (
    <div className='flex flex-col w-screen gap-4 pt-4'>
      <ScrollArea orientation='horizontal'>
        <div className='flex gap-2 pb-3 mx-auto w-fit'>
          {match.info.participants.map(
            ({ championId, summonerName }, index) => {
              return (
                <div
                  className={cn(
                    'flex flex-col items-center gap-2 w-28 hover:bg-foreground/10 rounded-lg p-2 transition-all duration-300 shrink-0 cursor-pointer text-sm',
                    {
                      'bg-foreground/5': selectedIndex === index,
                    },
                  )}
                  key={index}
                  onClick={() => {
                    setSelectedIndex(index);
                  }}
                >
                  <ChampIcon champId={championId} size='lg' />
                  <div className='truncate'>{summonerName}</div>
                </div>
              );
            },
          )}
        </div>
      </ScrollArea>
      <div className='text-xl font-semibold text-center px-4'>
        Items
        <div className='p-2 mx-auto mt-1 border rounded-lg border-border w-fit'>
          <BuildPath patch={patch} build={builds[selected]} />
        </div>
      </div>
      <div className='text-xl font-semibold text-center px-4'>
        Skill Order
        <ScrollArea orientation='horizontal'>
          <div className='p-2 mx-auto mt-1 mb-3 border rounded-lg border-border w-fit'>
            <SkillOrder
              skillOrder={skillOrders[selected]}
              championId={participant.championId}
              patch={patch}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
