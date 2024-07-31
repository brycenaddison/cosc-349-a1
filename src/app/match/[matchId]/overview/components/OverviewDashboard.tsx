'use client';

import { X } from 'lucide-react';
import { createContext, useContext, useMemo, useState } from 'react';
import { arePlayersInvolved, emptyDashboard, getAssociatedTeam } from '../util';
import { EventFilter } from './EventFilter';
import { EventList } from './EventList';
import { EventTimeline } from './EventTimeline';
import { GoldChart } from './GoldChart';
import { PlayerSelector } from './PlayerSelector';
import { RiftMap } from './RiftMap';
import { type ViewOption, ViewSelector, defaultView } from './ViewSelector';
import { type Participants } from '@/lib/match';

/**
 * Represents an event in the event list.
 *
 * We choose to merge special kills with champion kills, since these
 * events are always paired together.
 */
export type ListEvent = Riot.MatchV5.TimelineEvent &
  (
    | {
        type: Exclude<
          Riot.MatchV5.TimelineEvent['type'],
          'CHAMPION_SPECIAL_KILL' | 'CHAMPION_KILL'
        >;
      }
    | {
        type: 'CHAMPION_KILL';
        specialKill?: Riot.MatchV5.TimelineEvent<'CHAMPION_SPECIAL_KILL'>;
      }
  ) & {
    team?: Riot.MatchV5.TeamId;
  };

/** Data for the overview page. */
export type OverviewContextType = {
  /** The Riot post-match timeline data. */
  timeline: Riot.MatchV5.Timeline;
  /** The list of parsed participants. */
  players: Participants;
  /**
   * The participant ids of filtered on players.
   *
   * If empty, no filter is applied.
   */
  selectedPlayers: number[];
  /** The participant id of the currently hovered player, if applicable. */
  hoveredPlayer: number | undefined;
  /** The currently selected graph. */
  view: ViewOption;
  /** Event types excluded from the event list. */
  excludedTypes: Riot.MatchV5.TimelineEvent['type'][];
  /** List of parsed and filtered events. */
  events: ListEvent[];
  /** The minute to filter events on. */
  minute: number | undefined;
  /** Sets the list of selected players. */
  setSelectedPlayers: (ids: number[] | ((ids: number[]) => number[])) => void;
  /** Sets or removes a hovered player. */
  setHoveredPlayer: (id: number | undefined) => void;
  /** Sets the type of gold graph to show. */
  setView: (view: ViewOption) => void;
  /** Sets the full list of event types to exclude from the event list. */
  setExcludedTypes: (
    types:
      | Riot.MatchV5.TimelineEvent['type'][]
      | ((
          types: Riot.MatchV5.TimelineEvent['type'][],
        ) => Riot.MatchV5.TimelineEvent['type'][]),
  ) => void;
  /** Sets or removes a minute to filter on. */
  setMinute: (minute: number | undefined) => void;
};

const OverviewContext = createContext<OverviewContextType>(emptyDashboard);

/** Returns data and setters from the overview page. */
export const useOverview = (): OverviewContextType =>
  useContext(OverviewContext);

/** Props for {@link OverviewDashboard}. */
export type OverviewDashboardProps = {
  /** The timeline data for the match. */
  timeline: Riot.MatchV5.Timeline;
  /** The list of players in the match. */
  players: Participants;
};

/**
 * A dashboard representing the Overview screen in post match, as well as
 * showing a comprehensive list of events in the match.
 */
export const OverviewDashboard = ({
  timeline,
  players,
}: OverviewDashboardProps): JSX.Element => {
  const [view, setView] = useState<ViewOption>(defaultView);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [hoveredPlayer, setHoveredPlayer] = useState<number | undefined>();
  const [excludedTypes, setExcludedTypes] = useState<
    Riot.MatchV5.TimelineEvent['type'][]
  >([
    'PAUSE_END',
    'ITEM_DESTROYED',
    'ITEM_PURCHASED',
    'ITEM_SOLD',
    'ITEM_UNDO',
    'SKILL_LEVEL_UP',
    'LEVEL_UP',
    'WARD_KILL',
    'WARD_PLACED',
  ]);
  const [minute, setMinute] = useState<number | undefined>();

  const events = useMemo(() => {
    let lastKillEvent: (ListEvent & { type: 'CHAMPION_KILL' }) | undefined;

    return timeline.info.frames
      .map((frame) => frame.events)
      .flat()
      .map((rawEvent) => {
        if (
          minute !== undefined &&
          Math.round(rawEvent.timestamp / 60000) !== minute
        ) {
          return undefined;
        }

        if (excludedTypes.some((type) => rawEvent.type === type)) {
          return undefined;
        }

        if (rawEvent.type === 'CHAMPION_SPECIAL_KILL') {
          if (!lastKillEvent) return undefined;

          lastKillEvent.specialKill = rawEvent;

          return undefined;
        }

        const event: ListEvent = {
          ...rawEvent,
          team: getAssociatedTeam(players, rawEvent),
        };

        if (event.type === 'CHAMPION_KILL') {
          lastKillEvent = event;
        }

        // we could add a ui filter for this at some point, but also lol
        if (
          event.type === 'WARD_PLACED' &&
          event.wardType === 'TEEMO_MUSHROOM'
        ) {
          return undefined;
        }

        return event;
      })
      .filter(
        (event): event is ListEvent =>
          event !== undefined &&
          arePlayersInvolved(players, selectedPlayers, event),
      );
  }, [excludedTypes, players, selectedPlayers, timeline.info.frames, minute]);

  return (
    <OverviewContext.Provider
      value={{
        timeline,
        players,
        selectedPlayers,
        hoveredPlayer,
        view,
        excludedTypes,
        events,
        minute,
        setSelectedPlayers,
        setHoveredPlayer,
        setView,
        setExcludedTypes,
        setMinute,
      }}
    >
      <div className='flex flex-col gap-3 px-2'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <ViewSelector />
          <PlayerSelector />
        </div>

        <div className='flex flex-wrap justify-center gap-3'>
          <div className='flex grow min-w-[400px] h-[512px]'>
            <GoldChart />
          </div>
          <RiftMap />
        </div>

        <EventTimeline />
        <div className='w-full flex justify-between'>
          <div>
            {minute !== undefined && (
              <div className='italic flex text-foreground/60 items-center'>
                Viewing minute {minute}
                <X
                  className='ml-2 cursor-pointer transition hover:text-foreground/80'
                  size={24}
                  onClick={() => {
                    setMinute(undefined);
                  }}
                />
              </div>
            )}
          </div>
          <EventFilter />
        </div>
        <EventList />
      </div>
    </OverviewContext.Provider>
  );
};
