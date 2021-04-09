import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
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
  const { changes, updateGuild, updateSelectedOption } = useContext(GuildContext);
  const { authenticated } = useContext(UserContext);
  const router = useRouter();
  const [selectedAutoroles, setSelectedAutoroles] = useState<Option[]>([]);

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
  }

  updateSelectedOption('autorole');
  updateGuild(guild.id);

  return (
    <Base guild={guild} option="autorole">
      <label htmlFor="autoRole"></label>

      <MultiSelect
        className={styles.autoroleSelector}
        options={guild.roles.map((r) => ({ label: r.name, value: r.id }))}
        value={selectedAutoroles}
        onChange={handleSelectedRolesChange}
        labelledBy="Selected the autoroles"
        hasSelectAll={false}
      />

      <p>{JSON.stringify(changes)}</p>
    </Base>
  );
}
