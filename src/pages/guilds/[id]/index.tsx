import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ChangeEvent, useContext, useState } from 'react';

import { initializeApollo } from '../../../apollo/client';
import Base from '../../../components/dashboard/Base';
import Error from '../../../components/Error';
import { GuildContext } from '../../../contexts/GuildContext';
import { UserContext } from '../../../contexts/UserContext';
import USER_GUILD, { UserGuild } from '../../../graphql/UserGuild';

export interface GuildProps {
  db: UserGuild['getDatabaseGuild'];
  guild: UserGuild['getDiscordGuild'];
}

export const getServerSideProps: GetServerSideProps<GuildProps> = async ({ params, req }) => {
  if (typeof params?.id !== 'string') return { notFound: true };

  req.headers.accept = '';

  const apolloClient = initializeApollo(null, req.headers);

  const { data } = await apolloClient.query<UserGuild>({
    query: USER_GUILD,
    variables: { id: params.id },
  });

  return {
    props: {
      db: data.getDatabaseGuild,
      guild: data.getDiscordGuild,
    },
  };
};

export default function Guild({ db, guild }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { addChange, changes, updateGuild } = useContext(GuildContext);
  const { authenticated } = useContext(UserContext);
  const [prefix, setPrefix] = useState(db?.prefix);
  const [storeCounts, setStoreCounts] = useState(db?.storeCounts);

  if (!authenticated) {
    return <Error message="You need to be logged in to view this page." statusCode={401} />;
  }

  if (!db || !guild) {
    return <Error message="Count not find the guild you're looking for" statusCode={403} />;
  }

  function handlePrefixChange(event: ChangeEvent<HTMLInputElement>) {
    setPrefix(event.target.value);
    addChange('prefix', event.target.value);
  }

  function handleStoreCountsChange(event: ChangeEvent<HTMLInputElement>) {
    setStoreCounts(event.target.checked);
    addChange('storeCounts', event.target.checked);
  }

  updateGuild(guild.id);

  return (
    <Base guild={guild} option="general">
      <label htmlFor="prefix">Prefix</label>
      <input
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        id="prefix"
        maxLength={5}
        onChange={handlePrefixChange}
        type="text"
        value={changes.prefix ?? prefix}
      />

      <div>
        <label htmlFor="storeCounts">Store Member Counts</label>
        <input
          checked={changes.storeCounts ?? storeCounts}
          onChange={handleStoreCountsChange}
          id="storeCounts"
          type="checkbox"
        />
      </div>

      <p>{JSON.stringify(changes)}</p>
    </Base>
  );
}
