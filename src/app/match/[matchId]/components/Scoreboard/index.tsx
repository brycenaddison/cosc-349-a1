import { Controller } from '@/app/match/[matchId]/components/Scoreboard/Controller';
import { PlayerScoreboard } from '@/app/match/[matchId]/components/Scoreboard/PlayerScoreboard';
import { TeamHeader } from '@/app/match/[matchId]/components/Scoreboard/TeamHeader';
import { getPatch } from '@/lib/utils';

const BLUE = 100;
const RED = 200;

/** Props for {@link Scoreboard}. */
export type ScoreboardProps = {
  /** Match data from Riot API. */
  matchData: Riot.MatchV5.Match;
  /** Size of the scoreboard. */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to use champion icons instead of splashes. */
  champIcon?: boolean;
  /** The name of the blue team. */
  blueTeam?: string;
  /** The name of the red team. */
  redTeam?: string;
};

/** A post-game scoreboard for a single game. */
export const Scoreboard = ({
  matchData,
  size = 'md',
  champIcon = false,
  blueTeam = 'Blue Team',
  redTeam = 'Red Team',
}: ScoreboardProps): JSX.Element => {
  const maxDamage = Math.max(
    ...matchData.info.participants.map((p) => p.totalDamageDealtToChampions),
  );
  const maxDamageTaken = Math.max(
    ...matchData.info.participants.map((p) => p.totalDamageTaken),
  );
  const maxCC = Math.max(
    ...matchData.info.participants.map((p) => p.timeCCingOthers),
  );

  const group = `${matchData.metadata.matchId}${size}${champIcon ? 'icon' : ''}`;

  const blueTeamData = matchData.info.teams.find((t) => t.teamId === BLUE);
  const redTeamData = matchData.info.teams.find((t) => t.teamId === RED);

  const blueTeamPlayers = matchData.info.participants.filter(
    (p) => p.teamId === BLUE,
  );

  const redTeamPlayers = matchData.info.participants.filter(
    (p) => p.teamId === RED,
  );

  const blueTeamStats = blueTeamPlayers.reduce(
    (acc, participant) => {
      return {
        kills: acc.kills + participant.kills,
        deaths: acc.deaths + participant.deaths,
        assists: acc.assists + participant.assists,
        gold: acc.gold + participant.goldEarned,
      };
    },
    {
      kills: 0,
      deaths: 0,
      assists: 0,
      gold: 0,
    },
  );

  const redTeamStats = redTeamPlayers.reduce(
    (acc, participant) => {
      return {
        kills: acc.kills + participant.kills,
        deaths: acc.deaths + participant.deaths,
        assists: acc.assists + participant.assists,
        gold: acc.gold + participant.goldEarned,
      };
    },
    {
      kills: 0,
      deaths: 0,
      assists: 0,
      gold: 0,
    },
  );

  const patch = getPatch(matchData);

  if (!blueTeamData || !redTeamData) {
    return <div>Team data not found</div>;
  }

  return (
    <div className='flex flex-col w-min'>
      <div className='flex w-full items-center justify-between'>
        <TeamHeader
          teamName={blueTeam}
          win={blueTeamData.win}
          bans={blueTeamData.bans}
          objectives={blueTeamData.objectives}
          size={size}
          kills={blueTeamStats.kills}
          deaths={blueTeamStats.deaths}
          assists={blueTeamStats.assists}
          gold={blueTeamStats.gold}
        />
        <Controller group={group} size={size} />
      </div>
      {blueTeamPlayers.map((participant) => (
        <PlayerScoreboard
          maxDamage={maxDamage}
          maxDamageTaken={maxDamageTaken}
          maxCC={maxCC}
          key={`player-${participant.puuid}`}
          participant={participant}
          size={size}
          group={group}
          icon={champIcon}
          patch={patch}
        />
      ))}
      <div className='h-4' />
      <TeamHeader
        teamName={redTeam}
        win={redTeamData.win}
        bans={redTeamData.bans}
        objectives={redTeamData.objectives}
        size={size}
        kills={redTeamStats.kills}
        deaths={redTeamStats.deaths}
        assists={redTeamStats.assists}
        gold={redTeamStats.gold}
      />
      {redTeamPlayers.map((participant) => (
        <PlayerScoreboard
          maxDamage={maxDamage}
          maxDamageTaken={maxDamageTaken}
          maxCC={maxCC}
          key={`player-${participant.puuid}`}
          participant={participant}
          size={size}
          group={group}
          icon={champIcon}
          patch={patch}
        />
      ))}
    </div>
  );
};
