'use client';

import { create } from 'zustand';

/** The type of the scoreboard controller store. */
type ScoreboardController = {
  /**
   * A map of controller keys to a map of columns to which index is selected.
   */
  valueMap: Map<string, Map<string, number>>;
  /** Moves a specific column left. */
  moveLeft: (groupKey: string, values: string[]) => void;
  /** Moves a specific column right. */
  moveRight: (groupKey: string, values: string[]) => void;
};

/**
 * Returns a unique key for a list of strings.
 */
const getKey = (values: string[]): string =>
  `${values.join('-')}#${values.length}`;

/** Creates a store handling scoreboard column controllers. */
const useScoreboardStore = create<ScoreboardController>((set) => ({
  valueMap: new Map(),
  moveLeft: (groupKey: string, values: string[]): void => {
    set((state) => {
      const map = new Map(state.valueMap);
      const group = map.get(groupKey) ?? new Map<string, number>();

      const key = getKey(values);
      const size = values.length;

      const index = group.get(key) ?? 0;

      map.set(groupKey, group);
      group.set(key, index - 1 < 0 ? size - 1 : index - 1);

      return { valueMap: map };
    });
  },
  moveRight: (groupKey: string, values: string[]): void => {
    set((state) => {
      const map = new Map(state.valueMap);
      const group = map.get(groupKey) ?? new Map<string, number>();

      const key = getKey(values);
      const size = values.length;

      const index = group.get(key) ?? 0;

      map.set(groupKey, group);
      group.set(key, (index + 1) % size);

      return { valueMap: map };
    });
  },
}));

/** A hook for creating and listening to a scoreboard value controller. */
export const useScoreboardControls = (
  /** The list of values within this column. */
  values: string[],
  /** A unique key for this controller. */
  name?: string,
): {
  /** Moves the column left. */
  moveLeft: () => void;
  /** Moves the column right. */
  moveRight: () => void;
  /** The currently selected value. */
  value: string;
} => {
  const { moveLeft, moveRight, valueMap } = useScoreboardStore();

  const key = name ?? 'default';

  const index = valueMap.get(key)?.get(getKey(values));
  const value = values[index ?? 0];

  return {
    moveLeft: () => {
      moveLeft(key, values);
    },
    moveRight: () => {
      moveRight(key, values);
    },
    value,
  };
};
