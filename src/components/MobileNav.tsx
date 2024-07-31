'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { type ReactNode, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';
import { links, name } from '@/config/config';
import { cn } from '@/lib/utils';

type MobileLinkProps = {
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  href: string;
};

const MobileLink = ({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps): JSX.Element => {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href);
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
};

export const MobileNav = (): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
        >
          <Menu />
          <span className='sr-only'>Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <Link href='/' className='flex items-center mr-4 md:hidden'>
        <span className='font-bold'>{name}</span>
      </Link>
      <SheetContent side='left' className='pr-0'>
        <MobileLink
          href='/'
          className='flex items-center'
          onOpenChange={setOpen}
        >
          <span className='font-bold'>{name}</span>
        </MobileLink>
        <ScrollArea className='my-4 h-[calc(100vh-8rem)] pb-10 pl-6'>
          <div className='flex flex-col space-y-3'>
            {links.map((link) => (
              <MobileLink
                key={link.href}
                href={link.href}
                onOpenChange={setOpen}
              >
                {link.label}
              </MobileLink>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
