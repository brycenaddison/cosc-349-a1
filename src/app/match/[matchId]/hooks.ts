'use client';

const scoreboardSettings = new Map<
  string,
  {
    set: (value: string) => void;
    values: string[];
    index: number;
  }[]
>();

export const useScoreboardControls = (
  name?: string,
): {
  add: ({
    set,
    values,
  }: {
    set: (string: string) => void;
    values: string[];
  }) => void;
  moveLeft: () => void;
  moveRight: () => void;
} => {
  const key = name ?? 'default';

  const add = ({
    set,
    values,
  }: {
    set: (string: string) => void;
    values: string[];
  }): void => {
    scoreboardSettings.set(key, [
      ...(scoreboardSettings.get(key) ?? []),
      { set, values, index: 0 },
    ]);
  };

  const moveLeft = (): void => {
    scoreboardSettings.get(key)?.forEach((obj) => {
      obj.index = obj.index - 1 < 0 ? obj.values.length - 1 : obj.index - 1;
      obj.set(obj.values[obj.index]);
    });
  };

  const moveRight = (): void => {
    scoreboardSettings.get(key)?.forEach((obj) => {
      obj.index = (obj.index + 1) % obj.values.length;
      obj.set(obj.values[obj.index]);
    });
  };

  return {
    add,
    moveLeft,
    moveRight,
  };
};
