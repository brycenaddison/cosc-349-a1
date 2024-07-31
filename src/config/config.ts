import { exampleMatches } from '@/app/match/[matchId]/page';

export type Link = {
  href: string;
  label: string;
};

export const links: Link[] = [
  {
    href: `/match/${exampleMatches[0]}/`,
    label: 'Match History',
  },
];

export const name = 'Stats';
