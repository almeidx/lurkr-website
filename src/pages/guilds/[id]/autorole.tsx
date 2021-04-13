import ms from '@almeidx/ms';
import type { Snowflake } from 'discord-api-types/common';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';
import MultiSelect from 'react-multi-select-component';
import type { Option } from 'react-multi-select-component/dist/lib/interfaces';

import { initializeApollo } from '../../../apollo/client';
import Base from '../../../components/dashboard/Base';
import Error from '../../../components/Error';
import { GuildContext } from '../../../contexts/GuildContext';
import { UserContext } from '../../../contexts/UserContext';
import AUTOROLE, { Autorole, Role } from '../../../graphql/dashboard/Autorole';
import styles from '../../../styles/pages/guilds/Autorole.module.css';

export interface GuildAutoroleProps {
  db: Autorole['getDatabaseGuild'];
  guild: Autorole['getDiscordGuild'];
}

export const getServerSideProps: GetServerSideProps<GuildAutoroleProps> = async ({ params, req }) => {
  if (typeof params?.id !== 'string') return { notFound: true };

  req.headers.accept = '';

  const apolloClient = initializeApollo(null, req.headers);

  const { data } = await apolloClient.query<Autorole>({
    query: AUTOROLE,
    variables: { id: params.id },
  });

  return {
    props: {
      db: data.getDatabaseGuild,
      guild: data.getDiscordGuild,
    },
  };
};

export default function GuildAutorole({ db, guild }: GuildAutoroleProps) {
  const { addChange, changes, updateGuild, updateSelectedOption } = useContext(GuildContext);
  const { authenticated } = useContext(UserContext);
  const router = useRouter();
  const [autoRoleTimeoutRaw, setAutoRoleTimeoutRaw] = useState(db?.autoRoleTimeout ? ms(db.autoRoleTimeout) : ms(0));
  const [autoRoleTimeout, setAutoRoleTimeout] = useState(db?.autoRoleTimeout ? String(db.autoRoleTimeout) : undefined);
  const [selectedAutoroles, setSelectedAutoroles] = useState<Option[]>([]);

  const memoizedRoles = useMemo(
    () =>
      (guild &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        [...guild.roles].sort((a, b) => b.position - a.position).map((r) => ({ label: r.name, value: r.id }))) ||
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
    if (!db?.autoRole?.length || !guild) return;

    const guildRoles = db.autoRole.map((i) => guild.roles.find((r) => r.id === i)).filter((r) => r) as Role[];

    if (guildRoles.length) {
      setSelectedAutoroles(guildRoles.map(({ id, name }) => ({ label: name, value: id })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!db || !guild) {
    return <Error message="Count not find the guild you're looking for" statusCode={403} />;
  }

  function handleSelectedRolesChange(values: Option[]) {
    if (selectedAutoroles.length >= 5) return;
    setSelectedAutoroles(values);
    console.log(values);
    addChange(
      'autoRole',
      values.map((o) => o.value as Snowflake),
    );
  }

  function handleAutoRoleTimeoutChange(event: ChangeEvent<HTMLInputElement>) {
    const timeoutConvertedToMs = ms(event.target.value || '0');

    setAutoRoleTimeout(event.target.value);
    setAutoRoleTimeoutRaw(ms(timeoutConvertedToMs, false, true));

    addChange('autoRoleTimeout', timeoutConvertedToMs);
  }

  updateSelectedOption('autorole');
  updateGuild(guild.id);

  return (
    <Base guild={guild} option="autorole">
      <label htmlFor="autoRole" style={{ marginBottom: '-1.5rem' }}>
        Auto Roles
      </label>
      {memoizedRoles && (
        <MultiSelect
          className={styles.autoroleSelector}
          options={memoizedRoles}
          value={selectedAutoroles}
          onChange={handleSelectedRolesChange}
          labelledBy="Selected the autoroles"
          hasSelectAll={false}
        />
      )}

      <label htmlFor="autoRoleTimeout">Auto Role Timeout</label>
      <div style={{ marginTop: 0 }}>
        <input value={autoRoleTimeout} onChange={handleAutoRoleTimeoutChange} id="autoRoleTimeout" type="text" />
        <p style={{ marginLeft: '1rem' }}>Parsed: {autoRoleTimeoutRaw}</p>
      </div>

      <p>{JSON.stringify(changes)}</p>
    </Base>
  );
}
