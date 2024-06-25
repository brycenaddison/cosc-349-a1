'use client';
import { useEffect } from 'react';

// Error components must be Client Components

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div>
      error{' '}
      <button className='button' onClick={reset}>
        reset
      </button>
    </div>
  );
}
