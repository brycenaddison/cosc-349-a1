import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useOverview } from './OverviewDashboard';
import { Button } from '@/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';

/** Colloquial names for event types. */
const eventNames = {
  BUILDING_KILL: 'Building kills',
  CHAMPION_KILL: 'Champion kills',
  CHAMPION_SPECIAL_KILL: 'Champion special kills',
  ELITE_MONSTER_KILL: 'Epic monster kills',
  GAME_END: 'Game end',
  LEVEL_UP: 'Level ups',
  OBJECTIVE_BOUNTY_FINISH: 'Objective bounty finishes',
  OBJECTIVE_BOUNTY_PRESTART: 'Objective bounty starts',
  TURRET_PLATE_DESTROYED: 'Turret plate kills',
  WARD_KILL: 'Ward kills',
  WARD_PLACED: 'Ward places',
  DRAGON_SOUL_GIVEN: 'Dragon soul given',
  /* Not yet implemented
  PAUSE_END: 'Game start',
  ITEM_DESTROYED: 'Item consumes',
  ITEM_PURCHASED: 'Item purchases',
  ITEM_SOLD: 'Item sells',
  ITEM_UNDO: 'Item purchase undos',
  SKILL_LEVEL_UP: 'Skill level ups',
  */
} as const;

/**
 * A dropdown menu allowing the selection of which event types to show in the
 * {@link EventList}.
 */
export const EventFilter = (): JSX.Element => {
  const { setExcludedTypes, excludedTypes } = useOverview();

  const [unsavedChanges, setUnsavedChanges] = useState<
    Riot.MatchV5.TimelineEvent['type'][] | undefined
  >();

  const types = unsavedChanges ?? excludedTypes;

  return (
    <Popover
      onOpenChange={(open) => {
        if (open || unsavedChanges === undefined) return;
        setExcludedTypes(unsavedChanges);
        setUnsavedChanges(undefined);
      }}
    >
      <PopoverTrigger>
        <div className='flex text-foreground/60 hover:text-foreground/80 transition text-nowrap gap-2'>
          <div>Filter events</div>
          <div>
            <ChevronDown />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className='p-1'>
        <div className='flex flex-col'>
          {Object.entries(eventNames).map(([eventType, eventName]) => (
            <Button
              className='relative flex w-full select-none items-center rounded-sm py-1.5 h-8 pl-8 pr-2'
              variant='ghost'
              onClick={() => {
                const included = types.includes(
                  eventType as Riot.MatchV5.TimelineEvent['type'],
                );

                if (included) {
                  setUnsavedChanges(
                    types.filter((type) =>
                      eventType === 'CHAMPION_KILL'
                        ? type !== 'CHAMPION_KILL' &&
                          type !== 'CHAMPION_SPECIAL_KILL'
                        : type !== eventType,
                    ),
                  );
                } else {
                  setUnsavedChanges([
                    ...types,
                    eventType as Riot.MatchV5.TimelineEvent['type'],
                  ]);
                }
              }}
            >
              <span className='absolute left-1 flex h-3.5 w-3.5 items-center justify-center'>
                {!types.includes(
                  eventType as Riot.MatchV5.TimelineEvent['type'],
                ) && <Check className='h-4 w-4' />}
              </span>
              <div className='absolute left-6'>{eventName}</div>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
