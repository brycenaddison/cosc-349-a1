'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';

/** Structure of sections/stats to show in the table. */
const graphStats: Record<
  string,
  Record<string, (p: Riot.MatchV5.Participant) => number>
> = {
  'Damage Dealt to Champions': {
    'Total Damage to Champions': (p) => p.totalDamageDealtToChampions,
    'Physical Damage to Champions': (p) => p.physicalDamageDealtToChampions,
    'Magic Damage to Champions': (p) => p.magicDamageDealtToChampions,
    'True Damage to Champions': (p) => p.trueDamageDealtToChampions,
  },
  'Total Damage Dealt': {
    'Physical Damage Dealt': (p) => p.physicalDamageDealt,
    'Magic Damage Dealt': (p) => p.magicDamageDealt,
    'True Damage Dealt': (p) => p.trueDamageDealt,
    'Total Damage to Turrets': (p) => p.damageDealtToTurrets,
    'Total Damage to Objectives': (p) => p.damageDealtToObjectives,
  },
  'Damage Taken and Healed': {
    'Damage Healed': (p) => p.totalHeal,
    'Damage Taken': (p) => p.totalDamageTaken,
    'Physical Damage Taken': (p) => p.physicalDamageTaken,
    'Magic Damage Taken': (p) => p.magicDamageTaken,
    'True Damage Taken': (p) => p.trueDamageTaken,
    'Self Mitigated Damage': (p) => p.damageSelfMitigated,
  },
  Income: {
    'Gold Earned': (p) => p.goldEarned,
    'Gold Spent': (p) => p.goldSpent,
    'Minions Killed': (p) => p.totalMinionsKilled,
    'Jungle Minions Killed': (p) => p.neutralMinionsKilled,
  },
  Vision: {
    'Vision Score': (p) => p.visionScore,
    'Wards Placed': (p) => p.wardsPlaced,
    'Wards Destroyed': (p) => p.wardsKilled,
    'Control Wards Purchased': (p) => p.visionWardsBoughtInGame,
  },
};

const datasets = Object.values(graphStats).map((obj) => [
  ...Object.entries(obj).map(([name, value]) => ({ name, value })),
]);

const sections = Object.keys(graphStats);

/** The default selected datasets for the chart. */
export const defaultDatasets = [datasets[0][0]];

/** Props for {@link DataSelector}. */
export type DataSelectorProps = {
  /** Returns the selected datasets whenever they are changed. */
  onDatasetsChange: (
    datasets: {
      name: string;
      value: (p: Riot.MatchV5.Participant) => number;
    }[],
  ) => void;
};

/** A checkbox menu for selecting which datasets to show in the chart. */
export const DataSelector = ({
  onDatasetsChange,
}: DataSelectorProps): JSX.Element => {
  const [selected, setSelected] = useState<number[][]>([[0, 0]]);

  const update = (newSelected: number[][]): void => {
    const sorted = newSelected.toSorted(([a, b], [x, y]) => {
      if (a < x) return -1;
      if (a > x) return 1;
      if (b < y) return -1;
      if (b > y) return 1;
      return 0;
    });

    onDatasetsChange(sorted.map(([r, c]) => datasets[r][c]));

    setSelected(newSelected);
  };

  return (
    <div className='flex flex-col w-64 gap-2 p-4 text-sm'>
      {sections.map((section, row) => {
        const sectionChecked = selected.some(([r]) => r === row);
        return (
          <div key={section} className='flex flex-col w-full gap-2'>
            <div
              className='flex gap-2 items-center cursor-pointer'
              onClick={() => {
                sectionChecked
                  ? update(selected.filter(([r]) => r !== row))
                  : update([
                      ...selected,
                      ...datasets[row].map((_, c) => [row, c]),
                    ]);
              }}
            >
              <Checkbox checked={sectionChecked} />
              <div>{section}</div>
            </div>
            {datasets[row].map((dataset, column) => {
              const checked = selected.some(
                ([r, c]) => r === row && c === column,
              );

              return (
                <div
                  key={dataset.name}
                  className='flex gap-2 items-center ml-4 cursor-pointer'
                  onClick={() => {
                    checked
                      ? update(
                          selected.filter(
                            ([r, c]) => r !== row || c !== column,
                          ),
                        )
                      : update([...selected, [row, column]]);
                  }}
                >
                  <Checkbox checked={checked} />
                  <div>{dataset.name}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
