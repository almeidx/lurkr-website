import type { APIChannel, APIGuild } from 'discord-api-types/v8';
import { createContext, ReactNode, useState } from 'react';

export type GuildWithChannels = APIGuild & { channels: APIChannel[] };

export interface DatabaseGuild {
  _id: string;
  autoPublishChannels: string[] | null;
  autoRole: string[] | null;
  autoRoleTimeout: number | null;
  blacklistedChannels: string[] | null;
  counts: { count: number; date: Date }[];
  emojiList: boolean;
  emojiListChannel: string | null;
  lastRoleMentionAt: number | null;
  leftAt: number | null;
  levels: boolean;
  mentionCooldown: number;
  mentionCooldownRoles: string[] | null;
  milestones: { count: number; member: string }[];
  milestonesChannel: string | null;
  noXpRoles: string[] | null;
  prefix: string;
  premium: boolean;
  stackXpRoles: boolean;
  storeCounts: boolean;
  storeMilestones: boolean;
  topXp: string | null;
  topXpRole: string | null;
  xpBlacklistedChannels: string[] | null;
  xpRoles: Map<string, string[]>;
  xpWhitelistedChannels: string[] | null;
}

interface GuildContextData {
  guild: GuildWithChannels | null;
  changes: Record<string, unknown>[];
  db: DatabaseGuild | null;
  selectedOption: string;
  updateSelectedOption(value: string): void;
  addChange<T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]): void;
  updateGuild(discordGuild: GuildWithChannels, databaseGuild: DatabaseGuild): void;
}

interface GuildProviderProps {
  children: ReactNode;
}

export const GuildContext = createContext({} as GuildContextData);

export default function GuildProvider({ children }: GuildProviderProps) {
  const [guild, setGuild] = useState<GuildWithChannels | null>(null);
  const [db, setDb] = useState<DatabaseGuild | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('general');
  const [changes, setChanges] = useState<Record<string, unknown>[]>([]);

  function updateGuild(discordGuild: GuildWithChannels, databaseGuild: DatabaseGuild) {
    if (guild !== discordGuild) setGuild(discordGuild);
    if (db !== databaseGuild) setDb(databaseGuild);
  }

  function addChange<T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]) {
    setChanges([...changes, { key, value }]);
  }

  function updateSelectedOption(value: string) {
    setSelectedOption(value);
  }

  return (
    <GuildContext.Provider
      value={{
        addChange,
        changes,
        db,
        guild,
        selectedOption,
        updateGuild,
        updateSelectedOption,
      }}
    >
      {children}
    </GuildContext.Provider>
  );
}
