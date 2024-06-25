type Carousel = {
  refs: (HTMLDivElement | null)[];
  currentIndex: number;
};

const carousels = new Map<string, Carousel[]>();

export const useCarousel = (
  key = 'default',
): {
  add: (refs: (HTMLDivElement | null)[]) => void;
  scrollRight: () => void;
  scrollLeft: () => void;
} => {
  const add = (refs: (HTMLDivElement | null)[]): void => {
    const carousel = carousels.get(key) ?? [];

    if (carousel.length === 0) {
      carousels.set(key, carousel);
    }

    carousel.push({ refs, currentIndex: 0 });
  };

  const scrollToIndex = (carousel: Carousel, index: number): void => {
    carousel.currentIndex = index;

    carousel.refs[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  const scrollRight = (): void => {
    carousels.get(key)?.forEach((c) => {
      const nextIndex = (c.currentIndex + 1) % c.refs.length;

      scrollToIndex(c, nextIndex);
    });
  };

  const scrollLeft = (): void => {
    carousels.get(key)?.forEach((c) => {
      const nextIndex = (c.currentIndex - 1) % c.refs.length;

      scrollToIndex(c, nextIndex);
    });
  };

  return {
    add,
    scrollRight,
    scrollLeft,
  };
};
