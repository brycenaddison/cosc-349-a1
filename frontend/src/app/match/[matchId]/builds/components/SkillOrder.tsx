import { Ability } from '@/components/riotIcons/client/Ability';
import { cn } from '@/lib/utils';

/** Props for {@link SkillOrder}. */
export type SkillOrderProps = {
  /**
   * The skill max order of a player in a game.
   *
   * Q, W, E, and R spells are represented by 1, 2, 3, and 4 respectively.
   */
  skillOrder: number[];
  /** The numeric champion id of the player. */
  championId: number;
  /**
   * The patch the match is played on, for the purpose of grabbing skill
   * assets.
   */
  patch: string;
};

/** A component representing the skill max of a champion in a match. */
export const SkillOrder = ({
  skillOrder,
  championId,
  patch,
}: SkillOrderProps): JSX.Element => (
  <div className='flex flex-col gap-1'>
    {[1, 2, 3, 4].map((skill) => {
      return (
        <div key={skill} className='flex gap-0.5'>
          <Ability
            size='sm'
            championId={championId}
            ability={skill}
            patch={patch}
          />

          <div className='w-2' />

          {skillOrder.map((order, index) => {
            return (
              <div
                key={index}
                className={cn('h-8 w-8 rounded-lg border border-border', {
                  'bg-border': order === skill,
                })}
              >
                {order === skill ? index + 1 : ''}
              </div>
            );
          })}
        </div>
      );
    })}
  </div>
);
