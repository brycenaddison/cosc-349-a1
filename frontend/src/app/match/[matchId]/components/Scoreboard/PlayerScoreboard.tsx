import { CSGoldVision } from './CSGoldVision';
import { DamageMeter } from './DamageMeter';
import { ChampIcon } from '@/components/riotIcons/ChampIcon';
import { ChampScoreboard } from '@/components/riotIcons/ChampScoreboard';
import { Item } from '@/components/riotIcons/Item';
import { Role } from '@/components/riotIcons/Role';
import { Rune } from '@/components/riotIcons/Rune';
import { SummonerSpell } from '@/components/riotIcons/SummonerSpell';
import { cn } from '@/lib/utils';

/** Props for {@link PlayerScoreboard}. */
export type PlayerScoreboardProps = {
  /** The Riot post-match participant data. */
  participant: Riot.MatchV5.Participant;
  /** The most total damage dealt to champions by any player in the match. */
  maxDamage: number;
  /** The most damage taken from champions by any player in the match. */
  maxDamageTaken: number;
  /** The highest CC-score of any player in the match. */
  maxCC: number;
  /** The size of the scoreboard component. */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to use the champion icon layout instead of the splash layout. */
  icon?: boolean;
  /** The scoreboard's controller key. */
  group?: string;
  /** The patch the match is played on, using latest assets if undefined. */
  patch?: string;
};

/** An individual player's row in the match scoreboard. */
export const PlayerScoreboard = ({
  participant,
  maxDamage,
  maxDamageTaken,
  maxCC,
  size = 'md',
  icon = false,
  group,
  patch,
}: PlayerScoreboardProps): JSX.Element => {
  const {
    champLevel,
    championId,
    // puuid,
    teamPosition,
    kills,
    deaths,
    assists,
    summoner1Id,
    summoner2Id,
    perks,
    item0,
    item1,
    item2,
    item3,
    item4,
    item5,
    item6,
    totalDamageDealtToChampions,
    totalDamageTaken,
    timeCCingOthers,
    win,
    timePlayed,
    totalMinionsKilled,
    neutralMinionsKilled,
    goldEarned,
    visionWardsBoughtInGame,
    wardsPlaced,
    wardsKilled,
    summonerName,
  } = participant;

  // const summonerName = await getSummonerName(puuid);

  const summonerNameComponent = (
    <div
      className={cn('font-semibold shrink-0', {
        'text-2xl mb-1 w-60': size === 'lg',
        'text-xl mb-[3px] w-48': size === 'md',
        'text-md mb-0.5 w-36': size === 'sm',
      })}
    >
      {summonerName}
    </div>
  );

  const itemComponent = (
    <div
      className={cn('flex shrink-0', {
        'gap-1': size === 'lg',
        'gap-[3px]': size === 'md',
        'gap-0.5': size === 'sm',
      })}
    >
      {[item0, item1, item2, item3, item4, item5, item6].map((itemId) => (
        <Item key={itemId} item={itemId} size={size} patch={patch} />
      ))}
    </div>
  );

  const runeSize = size === 'sm' ? 13 : size === 'md' ? 20 : 26;

  const spellComponent = (
    <div
      className={cn('flex shrink-0', {
        'gap-0.5 m-0.5': size !== 'lg',
        'gap-1 m-1': size === 'lg',
      })}
    >
      <div
        className={cn('flex flex-col', {
          'gap-0.5': size !== 'lg',
          'gap-1': size === 'lg',
        })}
      >
        <SummonerSpell spellId={summoner1Id} size={size} patch={patch} />
        <SummonerSpell spellId={summoner2Id} size={size} patch={patch} />
      </div>

      <div
        className={cn('flex flex-col items-center justify-between shrink-0', {
          'gap-0.5': size !== 'lg',
          'gap-1': size === 'lg',
        })}
      >
        <Rune
          patch={patch}
          slot={0}
          runeData={perks}
          type='primary'
          size={runeSize}
        />
        <Rune
          runeData={perks}
          type='secondary'
          size={runeSize}
          className={cn({
            'p-1': size === 'lg',
            'p-[3px]': size === 'md',
            'p-0.5': size === 'sm',
          })}
          patch={patch}
        />
      </div>
    </div>
  );

  const kda =
    deaths === 0
      ? 'Perfect'
      : Math.round(((kills + assists) * 100) / deaths) / 100;

  const kdaComponent = (
    <div
      className={cn('flex flex-col items-center whitespace-nowrap shrink-0', {
        'text-xl w-32': size === 'lg',
        'text-sm w-24': size === 'md',
        'text-[.6rem] w-16': size === 'sm',
      })}
    >
      <div
        className={cn('flex mt-auto font-semibold', {
          'gap-1': size === 'lg',
          'gap-[3px]': size === 'md',
          'gap-0.5': size === 'sm',
        })}
      >
        <span>{kills}</span>
        <span className='text-gray-500 font-normal'>/</span>
        <span>{deaths}</span>
        <span className='text-gray-500 font-normal'>/</span>
        <span>{assists}</span>
      </div>
      <div className='mb-auto'>
        <span
          className={cn('font-semibold', {
            'text-orange-400': kda === 'Perfect' || kda >= 5,
            'text-blue-400': kda !== 'Perfect' && kda >= 3 && kda < 5,
            'dark:text-gray-600 text-gray-400': kda !== 'Perfect' && kda < 3,
          })}
        >
          {kda === 'Perfect' ? kda : kda.toFixed(2)}
        </span>
        <span className='text-gray-300'> KDA</span>
      </div>
    </div>
  );

  const damageComponent = (
    <DamageMeter
      damage={totalDamageDealtToChampions}
      damageTaken={totalDamageTaken}
      cc={timeCCingOthers}
      maxDamage={maxDamage}
      maxDamageTaken={maxDamageTaken}
      maxCC={maxCC}
      size={size}
      group={group}
    />
  );

  const statComponent = (
    <CSGoldVision
      gold={goldEarned}
      cs={totalMinionsKilled + neutralMinionsKilled}
      timePlayed={timePlayed}
      controlWards={visionWardsBoughtInGame}
      wardsPlaced={wardsPlaced}
      wardsKilled={wardsKilled}
      group={group}
      size={size}
    />
  );

  return (
    <div
      className={cn('flex items-center relative border-l-2 min-w-max', {
        'gap-1 h-8 border-l-2': size === 'sm',
        'gap-1.5 h-12 border-l-[3px]': size === 'md',
        'gap-2 h-16 border-l-4': size === 'lg',

        'pl-2': size === 'lg' && icon,
        'pl-1.5': size === 'md' && icon,
        'pl-1': size === 'sm' && icon,

        'border-blue-400': win,
        'border-red-400': !win,
      })}
    >
      {icon ? (
        <>
          <Role role={teamPosition} size={size} />
          {size === 'sm' && (
            <div className='font-semibold text-md'>{champLevel}</div>
          )}
          <div className='relative'>
            <ChampIcon champId={championId} size={size} patch={patch} />
            {size !== 'sm' && (
              <div
                className={cn(
                  'absolute bottom-0 right-0 bg-black/50 text-center h-6 w-6 rounded-tl-lg rounded-br-lg',
                  {
                    'text-xs h-4 w-4': size === 'md',
                    'text-base h-6 w-6': size === 'lg',
                  },
                )}
              >
                {champLevel}
              </div>
            )}
          </div>
          {spellComponent}
          {summonerNameComponent}
          {kdaComponent}
          {itemComponent}
          {damageComponent}
          {statComponent}
        </>
      ) : (
        <>
          <ChampScoreboard
            level={champLevel}
            patch={patch}
            championId={championId}
            size={size}
          />
          {summonerNameComponent}
          {spellComponent}
          {itemComponent}
          {kdaComponent}
          {damageComponent}
          {statComponent}
        </>
      )}
    </div>
  );
};
