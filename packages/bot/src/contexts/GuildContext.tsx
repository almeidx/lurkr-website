import { useMutation } from '@apollo/client';
import type { APIChannel, APIGuild } from 'discord-api-types/v8';
import { createContext, ReactNode, useCallback, useState } from 'react';

import type { Option } from '../components/dashboard/AsideOption';
import UPDATE_DATABASE_GUILD, { UpdateDatabaseGuild } from '../graphql/UpdateDatabaseGuild';

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
  xpMessage: string;
  xpResponseType: 'dm' | 'channel' | string | null;
  xpRoles: Map<string, string[]>;
  xpWhitelistedChannels: string[] | null;
}

interface GuildContextData {
  guildId: string | null;
  changes: Partial<DatabaseGuild>;
  selectedOption: Option;
  updateSelectedOption(value: Option): void;
  addChange<T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]): void;
  updateGuild(id: string): void;
  saveGuildChanges(): Promise<boolean>;
}

interface GuildProviderProps {
  children: ReactNode;
}

export const GuildContext = createContext({} as GuildContextData);

export default function GuildProvider({ children }: GuildProviderProps) {
  const [guildId, setGuildId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option>('general');
  const [changes, setChanges] = useState<Partial<DatabaseGuild>>({});
  const [update] = useMutation<UpdateDatabaseGuild>(UPDATE_DATABASE_GUILD);

  const updateGuild = useCallback(
    (id: string) => {
      if (guildId !== id) setGuildId(id);
    },
    [guildId],
  );

  const addChange = useCallback(
    <T extends keyof DatabaseGuild>(key: T, value: DatabaseGuild[T]) => {
      const clone = Object.assign({}, changes);
      clone[key] = value;
      setChanges(clone);
    },
    [changes],
  );

  const updateSelectedOption = useCallback((value: Option) => {
    setSelectedOption(value);
  }, []);

  const saveGuildChanges = useCallback(async () => {
    const clone = Object.assign({}, changes);
    setChanges({});
    await update({ variables: { data: clone, id: guildId } });
    return true;
  }, [changes, guildId, update]);

  return (
    <GuildContext.Provider
      value={{
        addChange,
        changes,
        guildId,
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
