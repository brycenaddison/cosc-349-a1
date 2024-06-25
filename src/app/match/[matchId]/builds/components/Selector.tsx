'use client';

import { useState } from 'react';
import { BuildPath } from '@/app/match/[matchId]/builds/components/BuildPath';
import { SkillOrder } from '@/app/match/[matchId]/builds/components/SkillOrder';
import { ChampIcon } from '@/components/riotIcons/ChampIcon';
import { getItemBuilds, getSkillOrders } from '@/lib/timeline';
import { cn, getPatch } from '@/lib/utils';

export type SelectorProps = {
  match: Riot.MatchV5.Match;
  timeline: Riot.MatchV5.Timeline;
};

export const Selector = ({ match, timeline }: SelectorProps): JSX.Element => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const participant = match.info.participants[selectedIndex];

  const { puuid: selected } = participant;

  const patch = getPatch(match);
  const builds = getItemBuilds(timeline);
  const skillOrders = getSkillOrders(timeline);

  return (
    <div className='flex gap-4 flex-col p-4 items-center'>
      <div className='flex gap-2 max-w-full overflow-x-scroll pb-3'>
        {match.info.participants.map(({ championId, summonerName }, index) => {
          return (
            <div
              className={cn(
                'flex flex-col items-center gap-2 w-36 hover:bg-white/20 rounded-lg p-2 transition-all duration-300 shrink-0',
                {
                  'bg-white/10': selectedIndex === index,
                },
              )}
              key={index}
              onClick={() => {
                setSelectedIndex(index);
              }}
            >
              <ChampIcon champId={championId} size='lg' />
              <div>{summonerName}</div>
            </div>
          );
        })}
      </div>
      <div className='text-center max-w-6xl font-semibold text-xl'>
        Items
        <div className='border rounded-lg border-gray-800 p-2 mt-1'>
          <BuildPath patch={patch} build={builds[selected]} />
        </div>
      </div>
      <div className='text-center max-w-6xl font-semibold text-xl'>
        Skill Order
        <div className='border rounded-lg border-gray-800 p-2 mt-1'>
          <SkillOrder
            skillOrder={skillOrders[selected]}
            championId={participant.championId}
            patch={patch}
          />
        </div>
      </div>
    </div>
  );
};
