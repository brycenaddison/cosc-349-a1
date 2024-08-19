import { range } from 'lodash-es';
import { type ReactNode } from 'react';
import { type ListEvent } from '../EventList';
import { Player } from './Player';
import { formatTimestamp } from '@/lib/utils';

/** Templates for different kinds of events. */
const templates = {
  KILL_MULTI: '$0 gets a $1 against $2',
  KILL_ACE: '$0 gets the ace by killing $1',
  KILL_FIRST_BLOOD: '$0 gets first blood against $1',
  EXECUTE: '$0 was executed',
  KILL: '$0 killed $1',
  LONG_STREAK: '$0, extending the kill streak to $1',
  STREAK: '$0 and $1',
  LEVEL_UP: '$0 leveled up to level $1',
  WARD_PLACED: '$0 placed a $1',
  WARD_KILLED: '$0 cleared a $1',
  DRAKE: '$0 slayed the $1 Drake',
  HORDE: '$0 slayed a void grub',
  BARON_NASHOR: '$0 slayed the Baron Nashor',
  RIFTHERALD: '$0 slayed the Rift Herald',
  TURRET_PLATE_DESTROYED: "$0 destroyed one of $1 team's $2 turret plates",
  BUILDING_KILL: "$0 destroyed $1 team's $2",
  NEXUS_TURRET_KILL: "$0 destroyed one of $1 team's Nexus turrets",
  OBJECTIVE_BOUNTY_PRESTART:
    'An objective bounty for the $0 team will start at $1',
  OBJECTIVE_BOUNTY_FINISH: 'The objective bounty for the $0 team fell off',
  GAME_END: 'The match has concluded with the $0 team winning',
  DRAGON_SOUL_GIVEN: 'The $0 team has claimed the $1 Soul',
} as const;

/** Display text for different multi kill lengths. */
const killLength: Record<number, string | undefined> = {
  2: 'double kill',
  3: 'triple kill',
  4: 'quadra kill',
  5: 'PENTAKILL',
};

/** Display text for different kill sprees. */
const killSprees: Record<number, string | undefined> = {
  3: 'goes on a killing spree',
  4: 'goes on a rampage',
  5: 'goes unstoppable',
  6: 'is dominating',
  7: 'goes godlike',
  8: 'goes legendary',
};

/** Display text for ward types. */
const wards: Record<Riot.MatchV5.WardType, string> = {
  YELLOW_TRINKET: 'stealth ward',
  BLUE_TRINKET: 'blue trinket',
  CONTROL_WARD: 'control ward',
  TEEMO_MUSHROOM: 'Noxious Trap',
  UNDEFINED: 'ward',
  SIGHT_WARD: 'stealth ward',
};

/** Display text for drakes. */
const drakes: Record<
  (Riot.MatchV5.TimelineEvent<'ELITE_MONSTER_KILL'> & {
    monsterType: 'DRAGON';
  })['monsterSubType'],
  string
> = {
  EARTH_DRAGON: 'Mountain',
  FIRE_DRAGON: 'Inferno',
  AIR_DRAGON: 'Cloud',
  WATER_DRAGON: 'Ocean',
  HEXTECH_DRAGON: 'Hextech',
  CHEMTECH_DRAGON: 'Chemtech',
  ELDER_DRAGON: 'Elder',
};

/** Display text for lanes. */
const lanes: Record<Riot.MatchV5.LaneType, string> = {
  BOT_LANE: 'bot lane',
  MID_LANE: 'mid lane',
  TOP_LANE: 'top lane',
};

/** Display text for tower tier. */
const towerPositionTiers = {
  INNER_TURRET: 'tier two',
  OUTER_TURRET: 'tier one',
  BASE_TURRET: 'tier three',
} as const;

/** Get the name of a building killed in an event. */
const getBuildingName = (
  event: Riot.MatchV5.TimelineEvent<'BUILDING_KILL'>,
): string => {
  if (event.buildingType === 'INHIBITOR_BUILDING') {
    return `${lanes[event.laneType]} inhibitor`;
  }

  if (event.towerType === 'NEXUS_TURRET') return 'Nexus turret';

  return `${lanes[event.laneType]} ${towerPositionTiers[event.towerType]} tower`;
};

/** Display text for team ids. */
const teams: Record<Riot.MatchV5.TeamId, string> = {
  100: 'blue',
  200: 'red',
};

/**
 * Joins a list of elements with a space, returning a new element.
 */
const joinTokens = (...tokens: ReactNode[]): JSX.Element => (
  <>
    {tokens.map((element, index) => {
      return (
        <span key={index}>
          {index !== 0 && <>&nbsp;</>}
          {element}
        </span>
      );
    })}
  </>
);

/**
 * Fills in a certain template with elements.
 *
 * Templates use a $# format, representing what index they want to pull the
 * data from.
 *
 * @param template The template to use
 * @param args The elements to fill the template with
 * @returns A filled template
 */
const parse = (
  template: keyof typeof templates,
  ...args: ReactNode[]
): JSX.Element => {
  const tokens = templates[template].split(' ');

  const parsedTokens: ReactNode[] = tokens.map((token) => {
    if (!token.startsWith('$')) return token;

    const index = parseInt(token.replace('$', ''));

    return args[index];
  });

  return joinTokens(...parsedTokens);
};

/**
 * Returns a text element for assisted events.
 *
 * @param ids The participant ids of the participating players.
 * @returns A text element with player elements for assisted events.
 */
const assistedBy = (ids: number[] | undefined): JSX.Element =>
  ids === undefined ? (
    <></>
  ) : (
    <>
      , assisted by&nbsp;
      {range(0, ids.length - 1).map((index) => (
        <span key={index}>
          {index !== 0 && <>,&nbsp;</>}
          <Player id={ids[index]} />
        </span>
      ))}
      {ids.length >= 2 && ' and '}
      <Player id={ids[ids.length - 1]} />
    </>
  );

/** Props for {@link EventText}. */
export type EventTextProps = {
  /** A processed and filtered event from the timeline. */
  event: ListEvent;
};

/** Creates a text element for a timeline event. */
export const EventText = ({ event }: EventTextProps): JSX.Element => {
  let value = <></>;

  switch (event.type) {
    case 'CHAMPION_KILL':
      switch (event.specialKill?.killType) {
        case 'KILL_MULTI':
          value = parse(
            'KILL_MULTI',
            <Player id={event.specialKill.killerId} />,
            killLength[event.specialKill.multiKillLength] ??
              `${event.specialKill.multiKillLength}-kill`,
            <Player id={event.victimId} />,
          );

          break;
        case 'KILL_ACE':
          value = parse(
            'KILL_ACE',
            <Player id={event.specialKill.killerId} />,
            <Player id={event.victimId} />,
          );

          break;
        case 'KILL_FIRST_BLOOD':
          value = parse(
            'KILL_FIRST_BLOOD',
            <Player id={event.specialKill.killerId} />,
            <Player id={event.victimId} />,
          );

          break;
        default:
          if (event.killerId === undefined || event.killerId === 0) {
            value = parse('EXECUTE', <Player id={event.victimId} />);

            break;
          }

          value = parse(
            'KILL',
            <Player id={event.killerId} />,
            <Player id={event.victimId} />,
          );
      }

      if (event.killStreakLength > 8) {
        value = parse('LONG_STREAK', value, event.killStreakLength);
      } else if (event.killStreakLength >= 3) {
        value = parse(
          'STREAK',
          value,
          killSprees[event.killStreakLength] ?? '',
        );
      }

      return (
        <>
          {value}
          {assistedBy(event.assistingParticipantIds)}
        </>
      );

    case 'LEVEL_UP':
      return parse(
        'LEVEL_UP',
        <Player id={event.participantId} />,
        event.level,
      );
    case 'WARD_PLACED':
      return parse(
        'WARD_PLACED',
        <Player id={event.creatorId} />,
        // TODO: add picture/color to text? Expand to items?
        wards[event.wardType],
      );
    case 'WARD_KILL':
      return parse(
        'WARD_KILLED',
        <Player id={event.killerId} />,
        wards[event.wardType],
      );
    case 'ELITE_MONSTER_KILL': {
      if (event.monsterType === 'DRAGON') {
        return (
          <>
            {parse(
              'DRAKE',
              <Player id={event.killerId} />,
              drakes[event.monsterSubType],
            )}
            {assistedBy(event.assistingParticipantIds)}
          </>
        );
      }

      return (
        <>
          {parse(event.monsterType, <Player id={event.killerId} />)}
          {assistedBy(event.assistingParticipantIds)}
        </>
      );
    }
    case 'TURRET_PLATE_DESTROYED':
      return parse(
        'TURRET_PLATE_DESTROYED',
        event.killerId === 0 ? 'A monster' : <Player id={event.killerId} />,
        teams[event.teamId],
        lanes[event.laneType],
      );
    case 'BUILDING_KILL':
      if (
        event.buildingType === 'TOWER_BUILDING' &&
        event.towerType === 'NEXUS_TURRET'
      ) {
        return (
          <>
            {parse(
              'NEXUS_TURRET_KILL',
              event.killerId === 0 ? (
                'A monster'
              ) : (
                <Player id={event.killerId} />
              ),
              teams[event.teamId],
            )}
            {assistedBy(event.assistingParticipantIds)}
          </>
        );
      }

      return (
        <>
          {parse(
            'BUILDING_KILL',
            event.killerId === 0 ? 'A monster' : <Player id={event.killerId} />,
            teams[event.teamId],
            getBuildingName(event),
          )}
          {assistedBy(event.assistingParticipantIds)}
        </>
      );
    case 'OBJECTIVE_BOUNTY_PRESTART':
      return parse(
        'OBJECTIVE_BOUNTY_PRESTART',
        teams[event.teamId],
        formatTimestamp(event.actualStartTime),
      );
    case 'OBJECTIVE_BOUNTY_FINISH':
      return parse('OBJECTIVE_BOUNTY_FINISH', teams[event.teamId]);
    case 'GAME_END':
      return parse('GAME_END', teams[event.winningTeam]);
    case 'DRAGON_SOUL_GIVEN':
      return parse('DRAGON_SOUL_GIVEN', teams[event.teamId], event.name);
    default:
      return <span>Unknown event: {event.type}</span>;
  }
};
