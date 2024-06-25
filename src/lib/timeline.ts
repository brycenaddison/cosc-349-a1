export type ItemBuild = {
  minute: number;
  items: {
    id: number;
    sold: boolean;
    quantity: number;
  }[];
}[];

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

export const getSkillOrders = (
  timeline: Riot.MatchV5.Timeline,
): Record<string, number[]> => {
  const skillOrders: Record<number, number[]> = Object.fromEntries(
    timeline.info.participants.map(({ participantId }) => [participantId, []]),
  );

  timeline.info.frames.forEach((frame) => {
    frame.events
      .filter(
        (
          event,
        ): event is Riot.MatchV5.TimelineEvent & { type: 'SKILL_LEVEL_UP' } =>
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
