import { Check } from 'lucide-react';

/** Props for {@link StatRow}. */
export type StatRowProps = {
  /** The Riot API match data. */
  match: Riot.MatchV5.Match;
  /** A label for the row. */
  label: string;
  /** Where to find the data to show for each participant. */
  getter: (participant: Riot.MatchV5.Participant) => number | boolean | string;
};

/**
 * A single row for the stat table.
 *
 * The two leftmost columns are a label, while the following ten are for each
 * participant in the match. Uses the getter function to extract what data to
 * show from the match history, which can include number, boolean, and string
 * data.
 */
export const StatRow = ({
  match,
  label,
  getter,
}: StatRowProps): JSX.Element => {
  return (
    <tr key={label}>
      <td className='w-6 lg:w-8 2xl:w-10' />
      <td className='text-foreground/80'>{label}</td>
      {match.info.participants.map(getter).map((value, index) => (
        <td key={index} className='align-middle text-center'>
          {typeof value === 'number'
            ? value.toLocaleString()
            : typeof value === 'string'
              ? value
              : value && <Check className='h-4 lg:h-5 2xl:h-6 block m-auto' />}
        </td>
      ))}
    </tr>
  );
};
