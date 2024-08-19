export const exampleMatches = ['4947148802', '4959299173'];

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
