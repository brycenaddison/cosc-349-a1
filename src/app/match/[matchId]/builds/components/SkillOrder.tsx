import { Ability } from '@/components/riotIcons/client/Ability';
import { cn } from '@/lib/utils';

export type SkillOrderProps = {
  skillOrder: number[];
  championId: number;
  patch: string;
};

export const SkillOrder = ({
  skillOrder,
  championId,
  patch,
}: SkillOrderProps): JSX.Element => {
  return (
    <div className='flex flex-col gap-1'>
      {[1, 2, 3, 4].map((skill) => {
        return (
          <div className='flex gap-0.5'>
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
                  className={cn('h-8 w-8 rounded-lg border border-gray-800', {
                    'bg-gray-800': order === skill,
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
};
