import { LoaderPinwheel } from 'lucide-react';

export default (): JSX.Element => (
  <div className='flex grow'>
    <div className='flex items-center m-auto gap-4 font-bold text-3xl'>
      <LoaderPinwheel size={32} className='animate-spin' />
      Loading...
    </div>
  </div>
);
