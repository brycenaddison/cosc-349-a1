'use client';

import { ClientItem } from '@/components/riotIcons/client/ClientItem';
import { type ItemBuild } from '@/lib/timeline';

/** Props for {@link BuildPath}. */
export type BuildPathProps = {
  /** The full list of item transactions of one player in a match. */
  build: ItemBuild;
  /**
   * The patch the match is played on, for the purpose of grabbing item assets. */
  patch: string;
};

/**
 * A component representing a list of items built and sold by a player in a
 * match.
 */
export const BuildPath = ({ build, patch }: BuildPathProps): JSX.Element => (
  <div className='flex flex-wrap w-full'>
    {build.map(({ minute, items }) => {
      return (
        <div
          className='flex flex-col items-center text-sm text-gray-500 dark:text-gray-400 p-2'
          key={minute}
        >
          <div className='flex flex-wrap min-w-16 bg-secondary rounded-lg p-2 gap-2'>
            {items.map(({ id, sold, quantity }, index) => {
              return (
                <div className='relative h-12 w-12 shrink-0' key={index}>
                  <ClientItem patch={patch} key={index} item={id} size='lg' />
                  {sold && (
                    <div className='pointer-events-none absolute bottom-0 rounded-lg right-0 top-0 left-0 bg-gray-800/50'>
                      <div className='absolute bottom-0 right-0 text-red-500 font-bold text-4xl'>
                        ×
                      </div>
                    </div>
                  )}
                  {!sold && quantity >= 2 && (
                    <div className='pointer-events-none absolute px-1 rounded-tl-lg rounded-br-lg bottom-0 right-0 bg-gray-800/50 text-white font-bold'>
                      {quantity}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {minute} min
        </div>
      );
    })}
  </div>
);
