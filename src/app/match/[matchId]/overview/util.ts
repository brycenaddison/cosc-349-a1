import { type OverviewContextType } from './components/OverviewDashboard';
import { defaultView } from './components/ViewSelector';
import { type Participants } from '@/lib/match';

/** Empty overview context for useContext fallback. */
export const emptyDashboard: OverviewContextType = {
  timeline: {
    metadata: {
      dataVersion: 'test',
      matchId: 'test',
      participants: [],
    },
    info: {
      frameInterval: 60000,
      frames: [],
      gameId: 0,
      participants: [],
    },
  },
  players: {},
  selectedPlayers: [],
  hoveredPlayer: undefined,
  view: defaultView,
  excludedTypes: [],
  events: [],
  allEvents: [],
  minute: undefined,
  setSelectedPlayers: () => null,
  setHoveredPlayer: () => null,
  setView: () => null,
  setExcludedTypes: () => null,
  setMinute: () => null,
};

/**
 * Whether the data in args includes any of the ids passed.
 *
 * @param ids Query ids
 * @param args Data to query
 * @returns  Whether the args include an id from the query
 */
const includesAny = (
  ids: number[],
  ...args: (number | undefined | number[])[]
): boolean => {
  const relatedIds = args.filter((value) => value !== undefined).flat();

  for (const id of ids) {
    for (const other of relatedIds) {
      if (id === other) return true;
    }
  }

  return false;
};

/**
 * Determines whether players participated in an event.
 *
 * @param players The full list of players in the match
 * @param ids The participant ids to filter on
 * @param event The event to check participants of
 * @returns Whether the event includes any of the participants
 */
export const arePlayersInvolved = (
  players: Participants,
  ids: number[],
  event: Riot.MatchV5.TimelineEvent,
): boolean => {
  if (ids.length === 0) return true;

  switch (event.type) {
    case 'BUILDING_KILL':
      return includesAny(ids, event.killerId, event.assistingParticipantIds);
    case 'CHAMPION_KILL':
      return includesAny(
        ids,
        event.victimId,
        event.killerId,
        event.assistingParticipantIds,
      );
    case 'CHAMPION_SPECIAL_KILL':
      return includesAny(ids, event.killerId);
    case 'ELITE_MONSTER_KILL':
      return ids.some((id) => players[id].teamId === event.killerTeamId);
    case 'LEVEL_UP':
      return includesAny(ids, event.participantId);
    case 'TURRET_PLATE_DESTROYED':
      return includesAny(ids, event.killerId);
    case 'WARD_KILL':
      return includesAny(ids, event.killerId);
    case 'WARD_PLACED':
      return includesAny(ids, event.creatorId);
    default:
      return false;
  }
};

/**
 * Get the team most associated with an event.
 *
 * For example, a red team player killing a blue team player is a red team
 * event.
 *
 * @param players List of match participants
 * @param event Timeline event to check
 * @returns Team id most associated with event, undefined if neither more
 * associated
 */
export const getAssociatedTeam = (
  players: Participants,
  event: Riot.MatchV5.TimelineEvent,
): undefined | 100 | 200 => {
  const getTeam = (participantId: number): undefined | 100 | 200 => {
    if (!(participantId in players)) return undefined;

    return players[participantId].teamId;
  };
  switch (event.type) {
    case 'BUILDING_KILL':
      return event.teamId === 100 ? 200 : 100;
    case 'CHAMPION_KILL':
      return getTeam(event.victimId) === 100 ? 200 : 100;
    case 'CHAMPION_SPECIAL_KILL':
      return getTeam(event.killerId);
    case 'ELITE_MONSTER_KILL':
      return getTeam(event.killerId);
    case 'GAME_END':
      return event.winningTeam;
    case 'ITEM_DESTROYED':
      return getTeam(event.participantId);
    case 'ITEM_PURCHASED':
      return getTeam(event.participantId);
    case 'ITEM_SOLD':
      return getTeam(event.participantId);
    case 'ITEM_UNDO':
      return getTeam(event.participantId);
    case 'LEVEL_UP':
      return getTeam(event.participantId);
    case 'OBJECTIVE_BOUNTY_FINISH':
      return event.teamId;
    case 'OBJECTIVE_BOUNTY_PRESTART':
      return event.teamId;
    case 'PAUSE_END':
      return undefined;
    case 'SKILL_LEVEL_UP':
      return getTeam(event.participantId);
    case 'TURRET_PLATE_DESTROYED':
      return event.teamId === 100 ? 200 : 100;
    case 'WARD_KILL':
      return getTeam(event.killerId);
    case 'WARD_PLACED':
      return getTeam(event.creatorId);
    case 'DRAGON_SOUL_GIVEN':
      return event.teamId;
    default:
      return undefined;
  }
};
