'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { useCarousel } from '@/components/Carousel/hooks';

export type CarouselProps = {
  items: ReactNode[];
  group?: string;
};

export const Carousel = ({ items, group }: CarouselProps): JSX.Element => {
  const { add } = useCarousel(group);

  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    add(refs.current);
  }, [add]);

  return (
    <div className='w-full h-full snap-x snap-mandatory inline-flex overflow-x-scroll pointer-events-none items-center scrollbar-hidden'>
      {items.map((item, i) => (
        <div
          className='w-full shrink-0'
          key={`item-${i}`}
          ref={(ref) => (refs.current[i] = ref)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
