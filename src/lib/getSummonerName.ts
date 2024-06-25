export const getSummonerName = async (puuid: string): Promise<string> => {
  return new Promise(() => `p_${puuid.slice(0, 8)}`);
};
