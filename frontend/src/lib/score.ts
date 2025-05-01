const coefs: Record<Riot.MatchV5.Role, number[]> = {
  TOP: [
    2.05190602, 1.01822173e-2, 3.59112116, -4.82810968e1, 3.56136002,
    -1.25636849e1, -3.21866297e-1, -5.31203345e-1, 4.29730034e-1,
    -8.47833267e-2, -1.37150856e-1, -1.9047374e-2, 2.21499667e-2,
    -1.37191872e-1, -1.88816038e-2, 2.22675107e-2, -1.37074648e-1,
    -1.8975848e-2, 2.14460127e-2, 1.37108017e-1, 1.9086275e-2, -2.23746851e-2,
    3.12742781e-1, -2.69364241e-1, 2.91173808e-2, 6.24004492e-3, -1.07660624,
    -7.6018861, -1.8559534e-1, 1.8500808e-1, 1.92569873,
  ],
  JUNGLE: [
    1.48337276, -1.47063602e-1, 4.47128636, -4.5736062e1, 1.69361913,
    7.55115311e-2, 3.46948565e-1, -2.41538323e-1, -1.75500042, -7.33902597e-2,
    -4.66409718e-1, -7.79458273e-2, -2.10414837e-1, -4.66382587e-1,
    -7.80375953e-2, -2.09758374e-1, -4.66433339e-1, -7.71027985e-2,
    -2.10502052e-1, 4.66457563e-1, 7.86679558e-2, 2.09710266e-1, -1.19970415e-1,
    -5.54297207e-1, 2.39679666e-2, 3.81054039e-3, 3.46165568e-1, -9.47640343,
    3.83023459e-1, -7.50442121e-2, 9.91040546e-1,
  ],
  MIDDLE: [
    2.15479536, -1.00098877e-1, 4.15925622, -4.82187594e1, 3.68021605,
    -1.11948168e1, -1.58629714e-1, -3.71854777e-1, 6.82302224e-1,
    -8.10197788e-2, -1.35714988e-1, 5.71724924e-2, -1.9843658e-3,
    -1.35693848e-1, 5.69466104e-2, -1.83329634e-3, -1.35624804e-1,
    5.64542062e-2, -2.54344182e-3, 1.35647275e-1, -5.68967696e-2, 1.47534194e-3,
    6.3195788e-1, -2.77328105e-1, 2.82892936e-2, 5.91334752e-3, -7.77378636e-1,
    -8.53875827, -1.09594632e-1, 1.73749354e-1, 1.2252875,
  ],
  BOTTOM: [
    3.38080946, 2.40900862e-3, 3.84975412, -5.19233988e1, 4.41626215,
    -2.05164675e1, -3.17058614e-1, -2.45535486e-1, 3.54649667e-1,
    -9.94602289e-2, -1.11983113e-1, 8.66515248e-2, 4.17146022e-2,
    -1.12012885e-1, 8.67562454e-2, 4.17232921e-2, -1.11955654e-1, 8.85275163e-2,
    4.10936706e-2, 1.12000345e-1, -8.62705058e-2, -4.26401827e-2, 7.13045955e-1,
    -2.11147553e-1, 2.70191241e-2, 9.38852246e-3, -3.85878266e-1, -7.99600092,
    -3.30389429e-1, 1.82188978e-1, 1.06218702,
  ],
  UTILITY: [
    1.86620822, -6.96300543e-1, 3.74232154, -6.25984285e1, 6.71671873,
    -1.1891733e1, -2.84798923e-1, -3.83229494e-1, 3.6371076e-1, -6.10442999e-2,
    -1.95304779e-1, -1.34879427e-1, -3.29199295e-2, -1.95069618e-1,
    -1.35708243e-1, -3.29664154e-2, -1.95032633e-1, -1.3524348e-1,
    -3.31994426e-2, 1.95392213e-1, 1.34519152e-1, 3.25527298e-2, 1.45720502e-1,
    -6.66295272e-1, 3.87989277e-2, 4.54919101e-3, -1.64847613, -7.96673224,
    2.67493058e-1, -5.65572675e-2, 7.34548452e-1,
  ],
} as const;

const getScore = (input: ModelInput): number => {
  if (input.min < 2) return 50;

  const coef = coefs[input.role];
  const value =
    coef[0] +
    input.killParticipation * coef[1] +
    input.deathPercent * coef[2] +
    input.goldPercent * coef[3] +
    input.csPercent * coef[4] +
    input.xpPercent * coef[5] +
    input.wardsPlacedPercent * coef[6] +
    input.wardsKilledPercent * coef[7] +
    input.damagePercent * coef[8] +
    input.min * coef[9] +
    input.magicDamageMin * coef[10] +
    input.magicDamageMinToChampions * coef[11] +
    input.magicDamageTakenMin * coef[12] +
    input.physicalDamageMin * coef[13] +
    input.physicalDamageMinToChampions * coef[14] +
    input.physicalDamageTakenMin * coef[15] +
    input.trueDamageMin * coef[16] +
    input.trueDamageMinToChampions * coef[17] +
    input.trueDamageTakenMin * coef[18] +
    input.totalDamageMin * coef[19] +
    input.totalDamageMinToChampions * coef[20] +
    input.totalDamageTakenMin * coef[21] +
    input.jungleMinionsKilledMin * coef[22] +
    input.minionsKilledMin * coef[23] +
    input.goldMin * coef[24] +
    input.xpMin * coef[25] +
    input.killsMin * coef[26] +
    input.deathsMin * coef[27] +
    input.assistsMin * coef[28] +
    input.wardsPlacedMin * coef[29] +
    input.wardsKilledMin * coef[30];
  const score = 100 / (1 + Math.exp(-value));
  return Number.isNaN(score) ? 50 : score;
};

/** Values for the model prediction dataset. */
type ModelInput = {
  role: Riot.MatchV5.Role;
  min: number;
  killParticipation: number;
  deathPercent: number;
  goldPercent: number;
  csPercent: number;
  xpPercent: number;
  wardsPlacedPercent: number;
  wardsKilledPercent: number;
  damagePercent: number;
  magicDamageMin: number;
  magicDamageMinToChampions: number;
  magicDamageTakenMin: number;
  physicalDamageMin: number;
  physicalDamageMinToChampions: number;
  physicalDamageTakenMin: number;
  trueDamageMin: number;
  trueDamageMinToChampions: number;
  trueDamageTakenMin: number;
  totalDamageMin: number;
  totalDamageMinToChampions: number;
  totalDamageTakenMin: number;
  jungleMinionsKilledMin: number;
  minionsKilledMin: number;
  goldMin: number;
  xpMin: number;
  killsMin: number;
  deathsMin: number;
  assistsMin: number;
  wardsPlacedMin: number;
  wardsKilledMin: number;
};

/**
 * Returns the dataset for the model score by puuid.
 *
 * @param match Match data
 * @param timeline A match timeline
 * @returns A record of each player in the match's puuid, mapped to their
 * model input.
 */
const getModelInputs = (
  match: Riot.MatchV5.Match,
  timeline: Riot.MatchV5.Timeline,
): Record<string, ModelInput[]> => {
  const result: Record<number, ModelInput[]> = Object.fromEntries(
    timeline.info.participants.map(({ participantId }) => [participantId, []]),
  );

  const info: Record<number, Riot.MatchV5.Participant> = Object.fromEntries(
    match.info.participants.map((participant) => [
      participant.participantId,
      participant,
    ]),
  );

  const cumulativeStats: Record<
    number,
    {
      kills: number;
      assists: number;
      deaths: number;
      wardsPlaced: number;
      wardsKilled: number;
    }
  > = Object.fromEntries(
    [
      ...timeline.info.participants.map(({ participantId }) => participantId),
      100,
      200,
    ].map((id) => [
      id,
      {
        kills: 0,
        deaths: 0,
        assists: 0,
        wardsPlaced: 0,
        wardsKilled: 0,
      },
    ]),
  );

  timeline.info.frames.forEach((frame) => {
    frame.events.forEach((event) => {
      if (event.type === 'CHAMPION_KILL') {
        cumulativeStats[event.victimId].deaths += 1;
        cumulativeStats[info[event.victimId].teamId].deaths += 1;

        if (event.killerId !== undefined && event.killerId in result) {
          cumulativeStats[event.killerId].kills += 1;
          cumulativeStats[info[event.killerId].teamId].kills += 1;
        }

        event.assistingParticipantIds?.forEach((id) => {
          cumulativeStats[id].assists += 1;
        });
      } else if (event.type === 'WARD_PLACED') {
        cumulativeStats[event.creatorId].wardsPlaced += 1;
        cumulativeStats[info[event.creatorId].teamId].wardsPlaced += 1;
      } else if (event.type === 'WARD_KILL') {
        cumulativeStats[event.killerId].wardsKilled += 1;
        cumulativeStats[info[event.killerId].teamId].wardsKilled += 1;
      }
    });

    const teamTotals: Record<
      Riot.MatchV5.TeamId,
      {
        kills: number;
        deaths: number;
        gold: number;
        cs: number;
        xp: number;
        wardsKilled: number;
        wardsPlaced: number;
        damageToChampions: number;
      }
    > = {
      100: {
        kills: 0,
        deaths: 0,
        gold: 0,
        cs: 0,
        xp: 0,
        wardsKilled: 0,
        wardsPlaced: 0,
        damageToChampions: 0,
      },
      200: {
        kills: 0,
        deaths: 0,
        gold: 0,
        cs: 0,
        xp: 0,
        wardsKilled: 0,
        wardsPlaced: 0,
        damageToChampions: 0,
      },
    };

    Object.entries(frame.participantFrames).forEach(
      ([participantId, participantFrame]) => {
        const stats = cumulativeStats[Number(participantId)];
        const teamId = info[Number(participantId)].teamId;
        const team = teamTotals[teamId];

        teamTotals[teamId] = {
          kills: team.kills + stats.kills,
          deaths: team.deaths + stats.deaths,
          gold: team.gold + participantFrame.totalGold,
          cs:
            team.cs +
            participantFrame.jungleMinionsKilled +
            participantFrame.minionsKilled,
          xp: team.xp + participantFrame.xp,
          damageToChampions:
            team.damageToChampions +
            participantFrame.damageStats.totalDamageDoneToChampions,
          wardsPlaced: team.wardsPlaced + stats.wardsPlaced,
          wardsKilled: team.wardsKilled + stats.wardsKilled,
        };
      },
    );

    Object.entries(frame.participantFrames).forEach(
      ([participantId, participantFrame]) => {
        const min = frame.timestamp / 60000;
        const stats = cumulativeStats[Number(participantId)];
        const team = teamTotals[info[Number(participantId)].teamId];
        const input = {
          role: info[Number(participantId)].teamPosition,
          min,
          magicDamageMin: participantFrame.damageStats.magicDamageDone / min,
          magicDamageMinToChampions:
            participantFrame.damageStats.magicDamageDoneToChampions / min,
          magicDamageTakenMin:
            participantFrame.damageStats.magicDamageTaken / min,
          physicalDamageMin:
            participantFrame.damageStats.physicalDamageDone / min,
          physicalDamageMinToChampions:
            participantFrame.damageStats.physicalDamageDoneToChampions / min,
          physicalDamageTakenMin:
            participantFrame.damageStats.physicalDamageTaken / min,
          trueDamageMin: participantFrame.damageStats.trueDamageDone / min,
          trueDamageMinToChampions:
            participantFrame.damageStats.trueDamageDoneToChampions / min,
          trueDamageTakenMin:
            participantFrame.damageStats.trueDamageTaken / min,
          totalDamageMin: participantFrame.damageStats.totalDamageDone / min,
          totalDamageMinToChampions:
            participantFrame.damageStats.totalDamageDoneToChampions / min,
          totalDamageTakenMin:
            participantFrame.damageStats.totalDamageTaken / min,
          jungleMinionsKilledMin: participantFrame.jungleMinionsKilled / min,
          minionsKilledMin: participantFrame.minionsKilled / min,
          goldMin: participantFrame.totalGold / min,
          xpMin: participantFrame.xp / min,
          killsMin: stats.kills / min,
          deathsMin: stats.deaths / min,
          assistsMin: stats.assists / min,
          wardsPlacedMin: stats.wardsPlaced / min,
          wardsKilledMin: stats.wardsKilled / min,
          killParticipation: (stats.kills + stats.assists) / (team.kills === 0 ? 1 : team.kills),
          deathPercent: stats.deaths / (team.deaths === 0 ? 1 : team.deaths),
          goldPercent: participantFrame.totalGold / (team.gold === 0 ? 1 : team.gold),
          csPercent:
            (participantFrame.jungleMinionsKilled +
              participantFrame.minionsKilled) /
            (team.cs === 0 ? 1 : team.cs),
          xpPercent: participantFrame.xp / (team.xp === 0 ? 1 : team.xp),
          wardsPlacedPercent: stats.wardsPlaced / (team.wardsPlaced === 0 ? 1 : team.wardsPlaced),
          wardsKilledPercent: stats.wardsKilled / (team.wardsKilled === 0 ? 1 : team.wardsKilled),
          damagePercent:
            participantFrame.damageStats.totalDamageDoneToChampions /
            (team.damageToChampions === 0 ? 1 : team.damageToChampions),
        };
        result[Number(participantId)].push(input);
      },
    );
  });

  return Object.fromEntries(
    Object.entries(result).map(([participantId, stamps]) => [
      info[Number(participantId)].puuid,
      stamps,
    ]),
  );
};

export const getScores = (
  match: Riot.MatchV5.Match,
  timeline: Riot.MatchV5.Timeline,
): Record<string, { x: number; y: number }[]> => {
  const data = getModelInputs(match, timeline);
  return Object.fromEntries(
    Object.entries(data).map(([puuid, inputs]) => [
      puuid,
      inputs.map((input) => ({
        x: input.min,
        y: Math.round(getScore(input)),
      })),
    ]),
  );
};
