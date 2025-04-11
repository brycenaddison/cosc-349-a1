export const getScores = (
  match: Riot.MatchV5.Match,
  timeline: Riot.MatchV5.Timeline,
): Record<string, { x: number, y: number }[]> => {
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
}

const coefs: Record<Riot.MatchV5.Role, number[]> = {
  'TOP': [2.05190602e+00, 1.01822173e-02, 3.59112116e+00, -4.82810968e+01,
    3.56136002e+00, -1.25636849e+01, -3.21866297e-01, -5.31203345e-01,
    4.29730034e-01, -8.47833267e-02, -1.37150856e-01, -1.90473740e-02,
    2.21499667e-02, -1.37191872e-01, -1.88816038e-02, 2.22675107e-02,
    -1.37074648e-01, -1.89758480e-02, 2.14460127e-02, 1.37108017e-01,
    1.90862750e-02, -2.23746851e-02, 3.12742781e-01, -2.69364241e-01,
    2.91173808e-02, 6.24004492e-03, -1.07660624e+00, -7.60188610e+00,
    -1.85595340e-01, 1.85008080e-01, 1.92569873e+00],
  'JUNGLE': [1.48337276e+00, -1.47063602e-01, 4.47128636e+00, -4.57360620e+01,
    1.69361913e+00, 7.55115311e-02, 3.46948565e-01, -2.41538323e-01,
    -1.75500042e+00, -7.33902597e-02, -4.66409718e-01, -7.79458273e-02,
    -2.10414837e-01, -4.66382587e-01, -7.80375953e-02, -2.09758374e-01,
    -4.66433339e-01, -7.71027985e-02, -2.10502052e-01, 4.66457563e-01,
    7.86679558e-02, 2.09710266e-01, -1.19970415e-01, -5.54297207e-01,
    2.39679666e-02, 3.81054039e-03, 3.46165568e-01, -9.47640343e+00,
    3.83023459e-01, -7.50442121e-02, 9.91040546e-01],
  'MIDDLE': [2.15479536e+00, -1.00098877e-01, 4.15925622e+00, -4.82187594e+01,
    3.68021605e+00, -1.11948168e+01, -1.58629714e-01, -3.71854777e-01,
    6.82302224e-01, -8.10197788e-02, -1.35714988e-01, 5.71724924e-02,
    -1.98436580e-03, -1.35693848e-01, 5.69466104e-02, -1.83329634e-03,
    -1.35624804e-01, 5.64542062e-02, -2.54344182e-03, 1.35647275e-01,
    -5.68967696e-02, 1.47534194e-03, 6.31957880e-01, -2.77328105e-01,
    2.82892936e-02, 5.91334752e-03, -7.77378636e-01, -8.53875827e+00,
    -1.09594632e-01, 1.73749354e-01, 1.22528750e+00],
  'BOTTOM': [3.38080946e+00, 2.40900862e-03, 3.84975412e+00, -5.19233988e+01,
    4.41626215e+00, -2.05164675e+01, -3.17058614e-01, -2.45535486e-01,
    3.54649667e-01, -9.94602289e-02, -1.11983113e-01, 8.66515248e-02,
    4.17146022e-02, -1.12012885e-01, 8.67562454e-02, 4.17232921e-02,
    -1.11955654e-01, 8.85275163e-02, 4.10936706e-02, 1.12000345e-01,
    -8.62705058e-02, -4.26401827e-02, 7.13045955e-01, -2.11147553e-01,
    2.70191241e-02, 9.38852246e-03, -3.85878266e-01, -7.99600092e+00,
    -3.30389429e-01, 1.82188978e-01, 1.06218702e+00],
  'UTILITY': [1.86620822e+00, -6.96300543e-01, 3.74232154e+00, -6.25984285e+01,
    6.71671873e+00, -1.18917330e+01, -2.84798923e-01, -3.83229494e-01,
    3.63710760e-01, -6.10442999e-02, -1.95304779e-01, -1.34879427e-01,
    -3.29199295e-02, -1.95069618e-01, -1.35708243e-01, -3.29664154e-02,
    -1.95032633e-01, -1.35243480e-01, -3.31994426e-02, 1.95392213e-01,
    1.34519152e-01, 3.25527298e-02, 1.45720502e-01, -6.66295272e-01,
    3.87989277e-02, 4.54919101e-03, -1.64847613e+00, -7.96673224e+00,
    2.67493058e-01, -5.65572675e-02, 7.34548452e-01],
} as const;

const getScore = (input: ModelInput): number => {
  const coef = coefs[input.role];
  const value = coef[0] +
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
}


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
}
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
    { kills: number; assists: number; deaths: number; wardsPlaced: number; wardsKilled: number }
  > = Object.fromEntries(
    [...timeline.info.participants.map(({ participantId }) => participantId), 100, 200].map((id) => [
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

    const teamTotals: Record<Riot.MatchV5.TeamId, { kills: number; deaths: number; gold: number; cs: number; xp: number; wardsKilled: number; wardsPlaced: number; damageToChampions: number; }> = {
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
    }

    Object.entries(frame.participantFrames).forEach(([participantId, participantFrame]) => {
      const stats = cumulativeStats[Number(participantId)];
      const teamId = info[Number(participantId)].teamId;
      const team = teamTotals[teamId];

      teamTotals[teamId] = {
        kills: team.kills + stats.kills,
        deaths: team.deaths + stats.deaths,
        gold: team.gold + participantFrame.totalGold,
        cs: team.cs + participantFrame.jungleMinionsKilled + participantFrame.minionsKilled,
        xp: team.xp + participantFrame.xp,
        damageToChampions: team.damageToChampions + participantFrame.damageStats.totalDamageDoneToChampions,
        wardsPlaced: team.wardsPlaced + stats.wardsPlaced,
        wardsKilled: team.wardsKilled + stats.wardsKilled,
      };
    });


    Object.entries(frame.participantFrames).forEach(([participantId, participantFrame]) => {
      const min = frame.timestamp / 60000;
      const stats = cumulativeStats[Number(participantId)];
      const team = teamTotals[info[Number(participantId)].teamId];
      const input = {
        role: info[Number(participantId)].teamPosition,
        min,
        magicDamageMin: participantFrame.damageStats.magicDamageDone / min,
        magicDamageMinToChampions: participantFrame.damageStats.magicDamageDoneToChampions / min,
        magicDamageTakenMin: participantFrame.damageStats.magicDamageTaken / min,
        physicalDamageMin: participantFrame.damageStats.physicalDamageDone / min,
        physicalDamageMinToChampions: participantFrame.damageStats.physicalDamageDoneToChampions / min,
        physicalDamageTakenMin: participantFrame.damageStats.physicalDamageTaken / min,
        trueDamageMin: participantFrame.damageStats.trueDamageDone / min,
        trueDamageMinToChampions: participantFrame.damageStats.trueDamageDoneToChampions / min,
        trueDamageTakenMin: participantFrame.damageStats.trueDamageTaken / min,
        totalDamageMin: participantFrame.damageStats.totalDamageDone / min,
        totalDamageMinToChampions: participantFrame.damageStats.totalDamageDoneToChampions / min,
        totalDamageTakenMin: participantFrame.damageStats.totalDamageTaken / min,
        jungleMinionsKilledMin: participantFrame.jungleMinionsKilled / min,
        minionsKilledMin: participantFrame.minionsKilled / min,
        goldMin: participantFrame.totalGold / min,
        xpMin: participantFrame.xp / min,
        killsMin: stats.kills / min,
        deathsMin: stats.deaths / min,
        assistsMin: stats.assists / min,
        wardsPlacedMin: stats.wardsPlaced / min,
        wardsKilledMin: stats.wardsKilled / min,
        killParticipation: (stats.kills + stats.assists) / team.kills,
        deathPercent: stats.deaths / team.deaths,
        goldPercent: participantFrame.totalGold / team.gold,
        csPercent: (participantFrame.jungleMinionsKilled + participantFrame.minionsKilled) / team.cs,
        xpPercent: participantFrame.xp / team.xp,
        wardsPlacedPercent: stats.wardsPlaced / team.wardsPlaced,
        wardsKilledPercent: stats.wardsKilled / team.wardsKilled,
        damagePercent: participantFrame.damageStats.totalDamageDoneToChampions / team.damageToChampions,
      }
      result[Number(participantId)].push(input);
    });
  })

  return Object.fromEntries(
    Object.entries(result).map(([participantId, stamps]) => [
      info[Number(participantId)].puuid,
      stamps,
    ]),
  );
}