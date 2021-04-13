import type { Snowflake } from 'discord-api-types/common';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import MultiSelect from 'react-multi-select-component';
import type { Option } from 'react-multi-select-component/dist/lib/interfaces';

import { initializeApollo } from '../../../apollo/client';
import Base from '../../../components/dashboard/Base';
import Error from '../../../components/Error';
import { DatabaseGuild, GuildContext } from '../../../contexts/GuildContext';
import { UserContext } from '../../../contexts/UserContext';
import type { Channel, Role } from '../../../graphql/dashboard/General';
import LEVELING, { Leveling } from '../../../graphql/dashboard/Leveling';
import styles from '../../../styles/pages/guilds/Leveling.module.css';

interface GuildLevelingProps {
  db: Leveling['getDatabaseGuild'];
  guild: Leveling['getDiscordGuild'];
}

type SortedStructures =
  | {
      label: string;
      value: Snowflake;
    }[]
  | null;

export const getServerSideProps: GetServerSideProps<GuildLevelingProps> = async ({ params, req }) => {
  if (typeof params?.id !== 'string') return { notFound: true };

  req.headers.accept = '';

  const apolloClient = initializeApollo(null, req.headers);

  const { data } = await apolloClient.query<Leveling>({
    query: LEVELING,
    variables: { id: params.id },
  });

  return {
    props: {
      db: data.getDatabaseGuild,
      guild: data.getDiscordGuild,
    },
  };
};

const castToOptionArray = (props: { id: Snowflake; name: string }[]) =>
  props.map(({ id, name }) => ({ label: name, value: id }));

export default function GuildLeveling({ db, guild }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { addChange, updateGuild, changes, updateSelectedOption } = useContext(GuildContext);
  const { authenticated } = useContext(UserContext);
  const router = useRouter();
  const [levels, setLevels] = useState(db?.levels);
  const [xpMessage, setXpMessage] = useState<string>(db?.xpMessage ?? '');
  const [selectedTopXpRole, setSelectedTopXpRole] = useState<Option | null>(null);
  const [selectedNoXpRoles, setSelectedNoXpRoles] = useState<Option[]>([]);
  const [selectedXpWhitelistedChannels, setSelectedXpWhitelistedChannels] = useState<Option[]>([]);
  const [selectedXpBlacklistedChannels, setSelectedXpBlacklistedChannels] = useState<Option[]>([]);

  const memoizedRoles = useMemo<SortedStructures>(
    () =>
      (guild &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        [...guild.roles].sort((a, b) => b.position - a.position).map((r) => ({ label: r.name, value: r.id }))) ||
      null,
    [guild],
  );

  const memoizedChannels = useMemo<SortedStructures>(
    () =>
      (guild &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        [...guild.channels]
          .sort((a, b) => b.name.localeCompare(a.name))
          .map((c) => ({
            label: c.name,
            value: c.id,
          }))) ||
      null,
    [guild],
  );

  useEffect(() => {
    if (!authenticated && guild) {
      void router.push(`/guilds/${guild.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!guild) return;

    if (db?.topXpRole) {
      const topXpGuildRole = guild.roles.find((r) => r.id === db.topXpRole);
      if (topXpGuildRole) {
        setSelectedTopXpRole({ label: topXpGuildRole.name, value: topXpGuildRole.id });
      }
    }

    if (db?.noXpRoles) {
      const noXpGuildRoles = db.noXpRoles.map((i) => guild.roles.find((r) => r.id === i)).filter((r) => r) as Role[];
      if (noXpGuildRoles.length) {
        setSelectedNoXpRoles(castToOptionArray(noXpGuildRoles));
      }
    }

    if (db?.xpBlacklistedChannels) {
      const xpBlacklistedGuildChannels = db.xpBlacklistedChannels
        .map((i) => guild.channels.find((c) => c.id === i))
        .filter((c) => c) as Channel[];

      if (xpBlacklistedGuildChannels.length) {
        setSelectedXpBlacklistedChannels(castToOptionArray(xpBlacklistedGuildChannels));
      }
    } else if (db?.xpWhitelistedChannels) {
      const xpWhitelistedGuildChannels = db.xpWhitelistedChannels
        .map((i) => guild.channels.find((c) => c.id === i))
        .filter((c) => c) as Channel[];

      if (xpWhitelistedGuildChannels.length) {
        setSelectedXpWhitelistedChannels(castToOptionArray(xpWhitelistedGuildChannels));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!db || !guild) {
    return <Error message="Count not find the guild you're looking for" statusCode={403} />;
  }

  function handleLevelsChange(event: ChangeEvent<HTMLInputElement>) {
    setLevels(event.target.checked);
    addChange('levels', event.target.checked);
  }

  function handleXpMessageChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (value.length > 1028) return;

    setXpMessage(value);
    addChange('xpMessage', value);
  }

  function handleSelectedTopXpRoleChange(values: Option[]) {
    if (values.length > 1) return;

    setSelectedTopXpRole(values[0] ?? null);

    addChange('topXpRole', values[0]?.value ?? null);
  }

  function handleGeneralOptionsChange(
    values: Option[],
    key: keyof DatabaseGuild,
    maxLength: number,
    updateState: (value: SetStateAction<Option[]>) => void,
  ) {
    if (values.length > maxLength) return;

    updateState(values);

    addChange(
      key,
      values.map((o) => o.value as Snowflake),
    );
  }

  updateSelectedOption('leveling');
  updateGuild(guild.id);

  return (
    <Base guild={guild} option="leveling">
      <div className={styles.horizontalSection}>
        <label htmlFor="levels">Levels</label>
        <input checked={changes.levels ?? levels} onChange={handleLevelsChange} id="levels" type="checkbox" />
      </div>

      <div className={styles.xpMessageContainer}>
        <label htmlFor="xpMessage">XP Message</label>
        <input value={changes.xpMessage ?? xpMessage} onChange={handleXpMessageChange} type="text" id="xpMessage" />
      </div>

      {memoizedRoles && (
        <>
          <div className={styles.multipleSelectorContainer}>
            <label htmlFor="topXpRole">Top XP Role</label>
            <MultiSelect
              options={memoizedRoles}
              value={selectedTopXpRole ? [selectedTopXpRole] : []}
              onChange={handleSelectedTopXpRoleChange}
              labelledBy="Select the Top XP Role"
              hasSelectAll={false}
            />
          </div>
          <div className={styles.multipleSelectorContainer}>
            <label htmlFor="noXpRoles">No XP Roles</label>
            <MultiSelect
              options={memoizedRoles}
              value={selectedNoXpRoles}
              onChange={(v: Option[]) => handleGeneralOptionsChange(v, 'noXpRoles', 5, setSelectedNoXpRoles)}
              labelledBy="Select the No XP Roles"
              hasSelectAll={false}
            />
          </div>
        </>
      )}

      {memoizedChannels && (
        <>
          <div className={styles.multipleSelectorContainer}>
            <label htmlFor="xpWhitelistedChannels">XP Channels</label>
            <MultiSelect
              options={memoizedChannels}
              value={selectedXpWhitelistedChannels}
              onChange={(v: Option[]) =>
                handleGeneralOptionsChange(v, 'xpWhitelistedChannels', 30, setSelectedXpWhitelistedChannels)
              }
              labelledBy="Select the XP Channels"
              hasSelectAll={false}
              disabled={selectedXpBlacklistedChannels.length !== 0}
            />
          </div>
          <div className={styles.multipleSelectorContainer}>
            <label htmlFor="xpBlacklistedChannels">Disabled XP Channels</label>
            <MultiSelect
              options={memoizedChannels}
              value={selectedXpBlacklistedChannels}
              onChange={(v: Option[]) =>
                handleGeneralOptionsChange(v, 'xpBlacklistedChannels', 30, setSelectedXpBlacklistedChannels)
              }
              labelledBy="Select the Disabled XP Channels"
              hasSelectAll={false}
              disabled={selectedXpWhitelistedChannels.length !== 0}
            />
          </div>
        </>
      )}

      <p>{JSON.stringify(changes)}</p>
    </Base>
  );
}
