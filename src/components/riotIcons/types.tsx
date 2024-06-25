/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace CDragon {
  export type Item = {
    id: number;
    name: string;
    description: string;
    active: boolean;
    inStore: boolean;
    from: number[];
    to: number[];
    categories: string[];
    maxStacks: number;
    requiredChampion: string;
    requiredAlly: string;
    requiredBuffCurrencyName: string;
    requiredBuffCurrencyCost: number;
    specialRecipe: number;
    isEnchantment: boolean;
    price: number;
    priceTotal: number;
    iconPath: string;
  };

  export type SummonerSpell = {
    id: number;
    name: string;
    description: string;
    cooldown: number;
    gamemodes: string[];
    iconPath: string;
    summonerLevel: number;
  };

  export type Champion = {
    id: number;
    name: string;
    alias: string;
    squarePortraitPath: string;
    roles: string[];
  };
}
