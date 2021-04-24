import ms from '@almeidx/ms';
import styles from '@styles/pages/guilds/Autorole.module.scss';
import type { Snowflake } from 'discord-api-types/v8';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react';

import Base from '../../../components/dashboard/Base';
import Error from '../../../components/Error';
import Selector from '../../../components/Selector';
import { GuildContext } from '../../../contexts/GuildContext';
import { UserContext } from '../../../contexts/UserContext';
import { initializeApollo } from '../../../graphql/client';
import AUTOROLE, { Autorole } from '../../../graphql/dashboard/Autorole';

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
  // const [autoRoles, setAutoRoles] = useState<Snowflake[]>([]);

  // const memoizedRoles = useMemo(
  //   () =>
  //     (guild &&
  //       // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  //       [...guild.roles].sort((a, b) => b.position - a.position).map((r) => ({ label: r.name, value: r.id }))) ||
  //     null,
  //   [guild],
  // );
  const memoizedRoles = useMemo(
    () =>
      (guild &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        [...guild.roles].sort((a, b) => b.position - a.position)) ||
      null,
    [guild],
  );

  useEffect(() => {
    if (!authenticated && guild) {
      void router.push(`/guilds/${guild.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (!db?.autoRole?.length || !guild) return;

  //   const autoGuildRoles = db.autoRole.map((i) => guild.roles.find((r) => r.id === i)).filter((r) => r) as Role[];
  //   if (autoGuildRoles.length) {
  //     setAutoRoles(autoGuildRoles.map(({ id }) => id));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  if (!db || !guild) {
    return <Error message="Count not find the guild you're looking for" statusCode={403} />;
  }

  function handleAutoRoleTimeoutChange(event: ChangeEvent<HTMLInputElement>) {
    const timeoutConvertedToMs = ms(event.target.value || '0');

    setAutoRoleTimeout(event.target.value);
    setAutoRoleTimeoutRaw(ms(timeoutConvertedToMs, false, true));

    addChange('autoRoleTimeout', timeoutConvertedToMs);
  }

  function handleRoleSelectorUpdate(state: Snowflake[]) {
    // setAutoRoles(state);
    addChange('autoRole', state);
  }

  updateSelectedOption('autorole');
  updateGuild(guild.id);

  return (
    <Base guild={guild} option="autorole">
      <div className={styles.autoRoleSelectorContainer}>
        <label htmlFor="autoRole">Auto Roles</label>
        {memoizedRoles && <Selector roles={memoizedRoles} onSelect={handleRoleSelectorUpdate} limit={5} />}
      </div>

      <div className={styles.autoRoleTimeoutContainer}>
        <label htmlFor="autoRoleTimeout">Auto Role Timeout</label>
        <div>
          <input value={autoRoleTimeout} onChange={handleAutoRoleTimeoutChange} id="autoRoleTimeout" type="text" />
          <p>Parsed: {autoRoleTimeoutRaw}</p>
        </div>
      </div>

      <p>{JSON.stringify(changes)}</p>
    </Base>
  );
}
