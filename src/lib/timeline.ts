import { groupBy } from 'lodash-es';
import { type MatchParticipant, type Participants } from '@/lib/match';

/** Represents one shop visit. */
export type ItemBuild = {
  /** The time of the shop visit. */
  minute: number;
  /** The transactions in the visit. */
  items: {
    /** The item id. */
    id: number;
    /** Whether the item was sold or not. */
    sold: boolean;
    /** How many of the item were purchased or sold. */
    quantity: number;
  }[];
}[];

/**
 * Removes ITEM_UNDO events from a list of events, along with the corresponding
 * ITEM_PURCHASED and ITEM_SOLD events.
 *
 * @param events The list of timeline events
 * @returns An updated list of timeline events with events removed
 */
const removeUndos = (
  events: Riot.MatchV5.TimelineEvent[],
): Riot.MatchV5.TimelineEvent[] => {
  const transactions: Riot.MatchV5.TimelineEvent[] = [];

  events.forEach((event) => {
    if (event.type === 'ITEM_UNDO') {
      const index = transactions.findLastIndex(
        (t) =>
          (t.type === 'ITEM_PURCHASED' || t.type === 'ITEM_SOLD') &&
          event.participantId === t.participantId,
      );

      transactions.splice(index, 1);
    } else {
      transactions.push(event);
    }
  });

  return transactions;
};

/**
 * Returns the complete list of shop transactions for each player in a game.
 *
 * @param timeline A match timeline
 * @returns A record of each player in the match's puuid, mapped to their item
 * build.
 */
export const getItemBuilds = (
  timeline: Riot.MatchV5.Timeline,
): Record<string, ItemBuild> => {
  const builds: Record<number, ItemBuild> = Object.fromEntries(
    timeline.info.participants.map(({ participantId }) => [participantId, []]),
  );

  const transactions = timeline.info.frames
    .map((frame) =>
      frame.events.filter((event) =>
        ['ITEM_PURCHASED', 'ITEM_SOLD', 'ITEM_UNDO'].includes(event.type),
      ),
    )
    .flat();

  removeUndos(transactions).forEach((t) => {
    // always true but makes typescript happy
    if (t.type !== 'ITEM_PURCHASED' && t.type !== 'ITEM_SOLD') {
      return;
    }

    const participantId = t.participantId;

    const minute = Math.round(t.timestamp / 60000);

    let buildThisMinute = builds[participantId].find(
      (build) => build.minute === minute,
    );

    if (!buildThisMinute) {
      buildThisMinute = {
        minute,
        items: [],
      };

      builds[participantId].push(buildThisMinute);
    }

    if (t.type === 'ITEM_PURCHASED') {
      const item = buildThisMinute.items.find((i) => i.id === t.itemId);

      if (item) item.quantity = item.quantity + 1;
      else {
        buildThisMinute.items.push({ id: t.itemId, sold: false, quantity: 1 });
      }
    }

    if (t.type === 'ITEM_SOLD') {
      const item = buildThisMinute.items.find((i) => i.id === t.itemId);

      if (item) item.quantity = item.quantity + 1;
      else {
        buildThisMinute.items.push({ id: t.itemId, sold: true, quantity: 1 });
      }
    }
  });

  const puuids = Object.fromEntries(
    timeline.info.participants.map((participant) => [
      participant.participantId,
      participant.puuid,
    ]),
  );

  return Object.fromEntries(
    Object.entries(builds).map(([participantId, build]) => [
      puuids[participantId],
      build,
    ]),
  );
};

/**
 * Returns the skill max order for each player in a game.
 *
 * @param timeline A match timeline
 * @returns A record of each player in the match's puuid, mapped to an array of
 * skill slots corresponding to the skill max order.
 */
export const getSkillOrders = (
  timeline: Riot.MatchV5.Timeline,
): Record<string, number[]> => {
  const skillOrders: Record<number, number[]> = Object.fromEntries(
    timeline.info.participants.map(({ participantId }) => [participantId, []]),
  );

  timeline.info.frames.forEach((frame) => {
    frame.events
      .filter(
        (event): event is Riot.MatchV5.TimelineEvent<'SKILL_LEVEL_UP'> =>
          event.type === 'SKILL_LEVEL_UP',
      )
      .forEach((event) => {
        skillOrders[event.participantId].push(event.skillSlot);
      });
  });

  const puuids = Object.fromEntries(
    timeline.info.participants.map((participant) => [
      participant.participantId,
      participant.puuid,
    ]),
  );

  return Object.fromEntries(
    Object.entries(skillOrders).map(([participantId, skills]) => [
      puuids[participantId],
      skills,
    ]),
  );
};

const aggregateStatValues = (timestamps: StatTimestamp[]): StatTimestamp[] =>
  Object.entries(groupBy(timestamps, 'timestamp')).map(([, values]) => {
    const value = values.reduce((acc, { value }) => acc + value, 0);
    return { timestamp: values[0].timestamp, value };
  });

/** The total of a stat at a certain timestamp. */
export type StatTimestamp = { timestamp: number; value: number };

export type EnhancedParticipantFrame = Riot.MatchV5.ParticipantFrame & {
  kills: number;
  deaths: number;
  assists: number;
};

/**
 * Aggregates stat data for each timestamp for each player and team.
 */
export const getStatInfo = (
  players: Participants,
  timeline: Riot.MatchV5.Timeline,
  stat: (participantFrame: EnhancedParticipantFrame) => number,
): {
  /** Each player's total gold at each timestamp. */
  participants: Record<
    number,
    { participant: MatchParticipant; timestamps: StatTimestamp[] }
  >;
  /** Blue team's total stat at each timestamp. */
  blue: StatTimestamp[];
  /** Red team's total stat at each timestamp. */
  red: StatTimestamp[];
  /** How ahead blue team is at each timestamp. */
  difference: StatTimestamp[];
} => {
  const participantStat: Record<
    number,
    {
      participant: MatchParticipant;
      timestamps: StatTimestamp[];
    }
  > = Object.fromEntries(
    timeline.info.participants.map(({ participantId }) => [
      participantId,
      {
        participant: players[participantId],
        timestamps: [],
      },
    ]),
  );

  const currentKills: Record<
    number,
    { kills: number; assists: number; deaths: number }
  > = Object.fromEntries(
    timeline.info.participants.map(({ participantId }) => [
      participantId,
      {
        kills: 0,
        deaths: 0,
        assists: 0,
      },
    ]),
  );

  const blueStat: StatTimestamp[] = [];
  const redStat: StatTimestamp[] = [];

  timeline.info.frames.forEach(({ timestamp, participantFrames, events }) => {
    events.forEach((event) => {
      if (event.type === 'CHAMPION_KILL') {
        currentKills[event.victimId].deaths += 1;
        if (event.killerId !== undefined && event.killerId in participantStat) {
          currentKills[event.killerId].kills += 1;
        }
        event.assistingParticipantIds?.forEach((id) => {
          currentKills[id].assists += 1;
        });
      }
    });

    Object.entries(participantFrames).forEach(([participantId, frame]) => {
      const value = stat({
        ...frame,
        ...currentKills[parseInt(participantId)],
      });

      const { timestamps, participant } =
        participantStat[parseInt(participantId)];

      timestamps.push({
        timestamp,
        value,
      });

      if (participant.teamId === 100) {
        blueStat.push({ timestamp, value });
      } else {
        redStat.push({ timestamp, value });
      }
    });
  });

  const difference = aggregateStatValues([
    ...blueStat,
    ...redStat.map(({ timestamp, value }) => ({ timestamp, value: -value })),
  ]);

  return {
    participants: participantStat,
    blue: aggregateStatValues(blueStat),
    red: aggregateStatValues(redStat),
    difference,
  };
};
