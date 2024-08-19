import Image from 'next/image';
import { cn, getAssetPath, getChampionDetails } from '@/lib/utils';

/** Styling for the champ scoreboard mask. */
const riotMask = `linear-gradient(
  90deg, 
  hsla(0, 0%, 77%, 0.26) 8.34%,
  hsla(0, 0%, 77%, 0.9) 34.37%,
  hsla(0, 0%, 77%, 0) 75.3%
)`;

/** Gets the image link to the splash screen of a champion. */
const getSrc = (championId: string, patch?: string): string =>
  getAssetPath(
    patch,
    `assets/characters/${championId.toLowerCase()}/skins/base/images/${championId.toLowerCase()}_splash_centered_0.jpg`,
  );

/** Props for {@link ChampScoreboard}. */
export type ChampScoreboardProps = {
  /** The numeric champion id. */
  championId: number;
  /** The patch of the game. */
  patch?: string;
  /** The final level of the player. */
  level?: number;
  /** The scoreboard size to use. */
  size?: 'sm' | 'md' | 'lg';
};

/**
 * A stylized champion splash with level emulating the post-game scoreboard in
 * the client.
 */
export const ChampScoreboard = async ({
  championId,
  patch,
  level = 0,
  size = 'md',
}: ChampScoreboardProps): Promise<JSX.Element> => {
  const champion = await getChampionDetails(championId, patch);

  return (
    <>
      <Image
        // The CDragon data doesn't have full images for some patches
        src={getSrc(champion.id, 'latest')}
        width={640}
        height={360}
        alt={`${champion.name}, ${champion.title}`}
        className={cn(
          'absolute h-full brightness-110 object-cover shadow-background-sm shadow-gray-800',
          {
            'w-[150px] -left-[15px] object-[0_-10px]': size === 'sm',
            'w-[225px] -left-[20px] object-[0_-15px]': size === 'md',
            'w-[300px] -left-[25px] object-[0_-20px]': size === 'lg',
          },
        )}
        style={{
          maskImage: riotMask,
          WebkitMaskImage: riotMask,
          maskPosition:
            size === 'lg' ? '25px' : size === 'md' ? '20px' : '15px',
          WebkitMaskPositionX:
            size === 'lg' ? '25px' : size === 'md' ? '20px' : '15px',
        }}
        priority
      />
      <div
        className={cn('absolute bg-gradient-to-r h-full from-background z-10', {
          'w-16': size === 'sm',
          'w-20': size === 'md',
          'w-24': size === 'lg',
        })}
      />
      <div
        className={cn('font-semibold z-20 shrink-0', {
          'text-2xl ml-4 w-48': size === 'lg',
          'text-xl ml-3 w-36': size === 'md',
          'text-md ml-2 w-24': size === 'sm',
        })}
      >
        {level}
      </div>
    </>
  );
};
