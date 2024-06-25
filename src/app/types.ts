/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Riot {
  export namespace MatchV5 {
    export type Match = {
      metadata: Metadata;
      info: Info;
    };

    export type Metadata = {
      dataVersion: string;
      matchId: string;
      participants: string[];
    };

    export type Info = {
      gameCreation: number;
      gameDuration: number;
      gameId: number;
      gameMode: string;
      gameName: string;
      gameStartTimestamp: number;
      gameType: string;
      gameVersion: string;
      mapId: number;
      participants: Participant[];
      platformId: string;
      queueId: number;
      teams: Team[];
      tournamentCode: string;
    };

    export type Participant = {
      assists: number;
      baronKills: number;
      bountyLevel: number;
      champExperience: number;
      champLevel: number;
      championId: number;
      championName: string;
      championTransform: number;
      consumablesPurchased: number;
      damageDealtToBuildings: number;
      damageDealtToObjectives: number;
      damageDealtToTurrets: number;
      damageSelfMitigated: number;
      deaths: number;
      detectorWardsPlaced: number;
      doubleKills: number;
      dragonKills: number;
      firstBloodAssist: boolean;
      firstBloodKill: boolean;
      firstTowerAssist: boolean;
      firstTowerKill: boolean;
      gameEndedInEarlySurrender: boolean;
      gameEndedInSurrender: boolean;
      goldEarned: number;
      goldSpent: number;
      individualPosition: Role;
      inhibitorKills: number;
      inhibitorTakedowns: number;
      inhibitorsLost: number;
      item0: number;
      item1: number;
      item2: number;
      item3: number;
      item4: number;
      item5: number;
      item6: number;
      itemsPurchased: number;
      killingSprees: number;
      kills: number;
      lane: string;
      largestCriticalStrike: number;
      largestKillingSpree: number;
      largestMultiKill: number;
      longestTimeSpentLiving: number;
      magicDamageDealt: number;
      magicDamageDealtToChampions: number;
      magicDamageTaken: number;
      neutralMinionsKilled: number;
      nexusKills: number;
      nexusTakedowns: number;
      nexusLost: number;
      objectivesStolen: number;
      objectivesStolenAssists: number;
      participantId: number;
      pentaKills: number;
      perks: Perks;
      physicalDamageDealt: number;
      physicalDamageDealtToChampions: number;
      physicalDamageTaken: number;
      profileIcon: number;
      puuid: string;
      quadraKills: number;
      riotIdName: string;
      riotIdTagline: string;
      role: string;
      sightWardsBoughtInGame: number;
      spell1Casts: number;
      spell2Casts: number;
      spell3Casts: number;
      spell4Casts: number;
      summoner1Casts: number;
      summoner1Id: number;
      summoner2Casts: number;
      summoner2Id: number;
      summonerId: string;
      summonerLevel: number;
      summonerName: string;
      teamEarlySurrendered: boolean;
      teamId: TeamId;
      teamPosition: Role;
      timeCCingOthers: number;
      timePlayed: number;
      totalDamageDealt: number;
      totalDamageDealtToChampions: number;
      totalDamageShieldedOnTeammates: number;
      totalDamageTaken: number;
      totalHeal: number;
      totalHealsOnTeammates: number;
      totalMinionsKilled: number;
      totalTimeCCDealt: number;
      totalTimeSpentDead: number;
      totalUnitsHealed: number;
      tripleKills: number;
      trueDamageDealt: number;
      trueDamageDealtToChampions: number;
      trueDamageTaken: number;
      turretKills: number;
      turretTakedowns: number;
      turretsLost: number;
      unrealKills: number;
      visionScore: number;
      visionWardsBoughtInGame: number;
      wardsKilled: number;
      wardsPlaced: number;
      win: boolean;
    };

    export type Role = 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY';

    export type Perks = {
      statPerks: PerkStats;
      styles: PerkStyle[];
    };

    export type PerkStats = {
      defense: number;
      flex: number;
      offense: number;
    };

    export type PerkStyle = {
      description: string;
      selections: PerkStyleSelection[];
      style: number;
    };

    export type PerkStyleSelection = {
      perk: number;
      var1: number;
      var2: number;
      var3: number;
    };

    export type TeamId = 100 | 200;

    export type Team = {
      bans: Ban[];
      objectives: Objective;
      teamId: TeamId;
      win: boolean;
    };

    export type Ban = {
      championId: number;
      pickTurn: number;
    };

    export type Objective = {
      baron: ObjectiveDetail;
      champion: ObjectiveDetail;
      dragon: ObjectiveDetail;
      inhibitor: ObjectiveDetail;
      riftHerald: ObjectiveDetail;
      tower: ObjectiveDetail;
    };

    export type ObjectiveDetail = {
      first: boolean;
      kills: number;
    };

    export type Timeline = {
      metadata: {
        dataVersion: string;
        matchId: string;
        participants: string[];
      };
      info: {
        frameInterval: number;
        frames: Frame[];
        gameId: number;
        participants: {
          participantId: number;
          puuid: string;
        }[];
      };
    };

    export type Frame = {
      events: TimelineEvent[];
      participantFrames: {
        [participantId: number]: ParticipantFrame;
        timestamp: number;
      };
    };

    export type Position = {
      x: number;
      y: number;
    };

    export type DeathRecapSpell = {
      basic: boolean;
      magicDamage: number;
      name: string;
      participantId: number;
      physicalDamage: number;
      spellName: string;
      spellSlot: number;
      trueDamage: number;
      type: string;
    };

    export type LaneType = 'BOT_LANE' | 'MID_LANE' | 'TOP_LANE';

    /** Contains only common event types */
    export type TimelineEvent = {
      timestamp: number;
      type: string;
    } & (
      | {
          type: 'PAUSE_END';
          realTimestamp: number;
        }
      | {
          type: 'ITEM_PURCHASED';
          participantId: number;
          itemId: number;
        }
      | {
          type: 'SKILL_LEVEL_UP';
          participantId: number;
          // haven't seen others
          levelUpType: 'NORMAL';
          skillSlot: number;
        }
      | {
          type: 'WARD_PLACED';
          creatorId: number;
          wardType: WardType;
        }
      | {
          type: 'LEVEL_UP';
          participantId: number;
          level: number;
        }
      | {
          type: 'ITEM_DESTROYED';
          participantId: number;
          itemId: number;
        }
      | {
          type: 'WARD_KILL';
          killerId: number;
          wardType: WardType;
        }
      | {
          type: 'ITEM_SOLD';
          participantId: number;
          itemId: number;
        }
      | {
          type: 'ITEM_UNDO';
          participantId: number;
          beforeId: number;
          afterId: number;
          goldGain: number;
        }
      | {
          type: 'ELITE_MONSTER_KILL';
          monsterType: 'HORDE' | 'RIFTHERALD' | 'BARON_NASHOR';
          killerTeamId: TeamId;
          killerId: number;
          bounty: number;
          assistingParticipantIds?: number[];
          position: Position;
        }
      | {
          type: 'ELITE_MONSTER_KILL';
          monsterType: 'DRAGON';
          monsterSubType:
            | 'EARTH_DRAGON'
            | 'FIRE_DRAGON'
            | 'WATER_DRAGON'
            | 'AIR_DRAGON'
            | 'CHEMTECH_DRAGON'
            | 'HEXTECH_DRAGON'
            | 'ELDER_DRAGON';
          killerTeamId: TeamId;
          killerId: number;
          bounty: number;
          assistingParticipantIds?: number[];
          position: Position;
        }
      | {
          type: 'TURRET_PLATE_DESTROYED';
          killerId: number;
          laneType: LaneType;
          position: Position;
          teamId: TeamId;
        }
      | {
          type: 'CHAMPION_KILL';
          killerId: number;
          killStreakLength: number;
          bounty: number;
          assistingParticipantIds?: number[];
          position: Position;
          shutdownBounty: number;
          victimDamageDealt: DeathRecapSpell[];
          victimDamageReceived: DeathRecapSpell[];
          victimId: number;
        }
      | {
          type: 'CHAMPION_SPECIAL_KILL';
          killType: 'KILL_MULTI';
          killerId: number;
          multiKillLength: number;
          position: Position;
        }
      | {
          type: 'CHAMPION_SPECIAL_KILL';
          killType: 'KILL_ACE' | 'KILL_FIRST_BLOOD';
          killerId: number;
          position: Position;
        }
      | {
          type: 'BUILDING_KILL';
          laneType: LaneType;
          assistingParticipantIds?: number[];
          bounty: number;
          buildingType: 'TOWER_BUILDING';
          killerId: number;
          position: Position;
          teamId: TeamId;
          towerType:
            | 'INNER_TURRET'
            | 'OUTER_TURRET'
            | 'BASE_TURRET'
            | 'NEXUS_TURRET';
        }
      | {
          type: 'BUILDING_KILL';
          laneType: LaneType;
          assistingParticipantIds?: number[];
          bounty: number;
          buildingType: 'INHIBITOR_BUILDING';
          killerId: number;
          position: Position;
          teamId: TeamId;
        }
      | {
          type: 'GAME_END';
          realTimestamp: number;
          gameId: number;
          winningTeam: TeamId;
        }
      | {
          type: 'OBJECTIVE_BOUNTY_PRESTART';
          actualStartTime: number;
          teamId: TeamId;
        }
      | {
          type: 'OBJECTIVE_BOUNTY_FINISH';
          teamId: TeamId;
        }
    );

    export type WardType =
      | 'YELLOW_TRINKET'
      | 'CONTROL_WARD'
      | 'SIGHT_WARD'
      | 'BLUE_TRINKET'
      | 'TEEMO_MUSHROOM'
      | 'UNDEFINED';

    export type ParticipantFrame = {
      championStats: ChampionStats;
      currentGold: number;
      damageStats: DamageStats;
      goldPerSecond: number;
      jungleMinionsKilled: number;
      level: number;
      minionsKilled: number;
      participantId: number;
      position: Position;
      timeEnemySpentControlled: number;
      totalGold: number;
      xp: number;
    };

    export type ChampionStats = {
      abilityHaste: number;
      abilityPower: number;
      armor: number;
      armorPen: number;
      armorPenPercent: number;
      attackDamage: number;
      attackSpeed: number;
      bonusArmorPenPercent: number;
      bonusMagicPenPercent: number;
      ccReduction: number;
      cooldownReduction: number;
      health: number;
      healthMax: number;
      healthRegen: number;
      lifesteal: number;
      magicPen: number;
      magicPenPercent: number;
      magicResist: number;
      movementSpeed: number;
      omnivamp: number;
      physicalVamp: number;
      power: number;
      powerMax: number;
      powerRegen: number;
      spellVamp: number;
    };

    export type DamageStats = {
      magicDamageDone: number;
      magicDamageDoneToChampions: number;
      magicDamageTaken: number;
      physicalDamageDone: number;
      physicalDamageDoneToChampions: number;
      physicalDamageTaken: number;
      totalDamageDone: number;
      totalDamageDoneToChampions: number;
      totalDamageTaken: number;
      trueDamageDone: number;
      trueDamageDoneToChampions: number;
      trueDamageTaken: number;
    };
  }

  export namespace DDragon {
    export type ItemLookup = {
      type: string;
      version: string;
      data: Record<
        string,
        {
          id: number;
          name: string;
          description: string;
          gold: {
            base: number;
            total: number;
            sell: number;
            purchasable: boolean;
          };
          plaintext: string;
          tags: string[];
          from: string[];
          into: string[];
          image: {
            full: string;
            sprite: string;
            group: string;
            x: number;
            y: number;
            w: number;
            h: number;
          };
        }
      >;
    };

    export type RuneLookup = {
      id: number;
      key: string;
      icon: string;
      name: string;
      slots: {
        runes: {
          id: number;
          key: string;
          icon: string;
          name: string;
          shortDesc: string;
          longDesc: string;
        }[];
      }[];
    };

    export type SummonerLookup = {
      type: string;
      version: string;
      data: Record<
        string,
        {
          id: string;
          name: string;
          description: string;
          tooltip: string;
          maxrank: number;
          cooldown: number[];
          cooldownBurn: string;
          cost: number[];
          costBurn: string;
          datavalues: Record<string, never>;
          effect: (number[] | null)[];
          effectBurn: (string | null)[];
          vars: {
            link: string;
            coeff: number;
            key: string;
          }[];
          key: string;
          summonerLevel: number;
          modes: string[];
          costType: string;
          maxammo: string;
          range: number[];
          rangeBurn: string;
          image: {
            full: string;
            sprite: string;
            group: string;
            x: number;
            y: number;
            w: number;
            h: number;
          };
          resource: string;
        }
      >;
    };

    export type ChampionShort = {
      version: string;
      id: string;
      key: string;
      name: string;
      title: string;
      blurb: string;
      info: {
        attack: number;
        defense: number;
        magic: number;
        difficulty: number;
      };
      image: {
        full: string;
        sprite: string;
        group: string;
        x: number;
        y: number;
        w: number;
        h: number;
      };
      tags: string[];
      partype: string;
      stats: {
        hp: number;
        hpperlevel: number;
        mp: number;
        mpperlevel: number;
        movespeed: number;
        armor: number;
        armorperlevel: number;
        spellblock: number;
        spellblockperlevel: number;
        attackrange: number;
        hpregen: number;
        hpregenperlevel: number;
        mpregen: number;
        mpregenperlevel: number;
        crit: number;
        critperlevel: number;
        attackdamage: number;
        attackdamageperlevel: number;
        attackspeedperlevel: number;
        attackspeed: number;
      };
    };

    export type ChampionLookup = {
      type: string;
      format: string;
      version: string;
      data: Record<string, ChampionShort>;
    };

    export type Champion = {
      id: string;
      key: string;
      name: string;
      title: string;
      image: {
        full: string;
        sprite: string;
        group: string;
        x: number;
        y: number;
        w: number;
        h: number;
      };
      skins: {
        id: string;
        num: number;
        name: string;
        chromas: boolean;
      }[];
      lore: string;
      blurb: string;
      allytips: string[];
      enemytips: string[];
      tags: string[];
      partype: string;
      info: {
        attack: number;
        defense: number;
        magic: number;
        difficulty: number;
      };
      stats: {
        hp: number;
        hpperlevel: number;
        mp: number;
        mpperlevel: number;
        movespeed: number;
        armor: number;
        armorperlevel: number;
        spellblock: number;
        spellblockperlevel: number;
        attackrange: number;
        hpregen: number;
        hpregenperlevel: number;
        mpregen: number;
        mpregenperlevel: number;
        crit: number;
        critperlevel: number;
        attackdamage: number;
        attackdamageperlevel: number;
        attackspeedperlevel: number;
        attackspeed: number;
      };
      spells: {
        id: string;
        name: string;
        description: string;
        tooltip: string;
        leveltip: {
          label: string[];
          effect: string[];
        };
        maxrank: number;
        cooldown: number[];
        cooldownBurn: string;
        cost: number[];
        costBurn: string;
        datavalues: Record<string, never>;
        effect: (number[] | null)[];
        effectBurn: (string | null)[];
        vars: {
          link: string;
          coeff: number;
          key: string;
        }[];
        costType: string;
        maxammo: string;
        range: number[];
        rangeBurn: string;
        image: {
          full: string;
          sprite: string;
          group: string;
          x: number;
          y: number;
          w: number;
          h: number;
        };
        resource: string;
      }[];
      passive: {
        name: string;
        description: string;
        image: {
          full: string;
          sprite: string;
          group: string;
          x: number;
          y: number;
          w: number;
          h: number;
        };
      };
    };

    export type ChampionResponse = {
      type: string;
      format: string;
      version: string;
      data: Record<string, Champion>;
    };
  }
}
