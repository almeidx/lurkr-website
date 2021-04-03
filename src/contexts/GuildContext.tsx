import type { APIChannel, APIGuild } from 'discord-api-types/v8';
import { createContext, ReactNode, useState } from 'react';

import api from '../services/api';

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
  addChange<T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]): boolean;
  updateGuild(discordGuild: GuildWithChannels, databaseGuild: DatabaseGuild): void;
  saveGuildChanges(): void;
}

interface GuildProviderProps {
  children: ReactNode;
}

export const GuildContext = createContext({} as GuildContextData);

export default function GuildProvider({ children }: GuildProviderProps) {
  const [guild, setGuild] = useState<GuildWithChannels | null>(null);
  const [db, setDb] = useState<DatabaseGuild | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('general');
  const [changes, setChanges] = useState<{ key: string; value: unknown }[]>([]);

  function updateGuild(discordGuild: GuildWithChannels, databaseGuild: DatabaseGuild) {
    if (guild !== discordGuild) setGuild(discordGuild);
    if (db !== databaseGuild) setDb(databaseGuild);
  }

  function addChange<T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]): boolean {
    if (db?.[key] === value) {
      const existingIndex = changes.findIndex((c) => c.key === key);
      if (existingIndex !== -1) {
        const clone = [...changes];
        clone.splice(existingIndex, 1);
        setChanges(clone);
      }

      return true;
    }

    const existingIndex = changes.findIndex((c) => c.key === key);
    if (existingIndex !== -1) {
      const clone = [...changes];
      clone[existingIndex] = { key, value };
      setChanges(clone);
      return true;
    }

    setChanges([...changes, { key, value }]);
    return true;
  }

  function updateSelectedOption(value: string) {
    setSelectedOption(value);
  }

  function saveGuildChanges() {
    void api.post(`/guilds/${guild!.id}`, changes);
    setChanges([]);
  }

  return (
    <GuildContext.Provider
      value={{
        addChange,
        changes,
        db,
        guild,
        saveGuildChanges,
        selectedOption,
        updateGuild,
        updateSelectedOption,
      }}
    >
      {children}
    </GuildContext.Provider>
  );
}
