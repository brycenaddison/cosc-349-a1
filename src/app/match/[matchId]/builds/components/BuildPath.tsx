'use client';

import { ClientItem } from '@/components/riotIcons/client/ClientItem';
import { type ItemBuild } from '@/lib/timeline';

export type BuildPathProps = {
  build: ItemBuild;
  patch: string;
};

export const BuildPath = ({ build, patch }: BuildPathProps): JSX.Element => (
  <div className='flex flex-wrap w-full'>
    {build.map(({ minute, items }) => {
      return (
        <div
          className='flex flex-col items-center text-sm text-gray-400 p-2 shrink-0'
          key={minute}
        >
          <div className='flex bg-gray-800 rounded-lg p-2 gap-2'>
            {items.map(({ id, sold, quantity }, index) => {
              return (
                <div className='relative h-12 w-12' key={index}>
                  <ClientItem patch={patch} key={index} item={id} size='lg' />
                  {sold && (
                    <div className='pointer-events-none absolute bottom-0 right-0 top-0 left-0 bg-gray-800/50'>
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
