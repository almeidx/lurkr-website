import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { initializeApollo } from '../../../apollo/client';
import Base from '../../../components/dashboard/Base';
import Error from '../../../components/Error';
import { GuildContext } from '../../../contexts/GuildContext';
import { UserContext } from '../../../contexts/UserContext';
import LEVELING, { Leveling } from '../../../graphql/dashboard/Leveling';

interface GuildLevelingProps {
  db: Leveling['getDatabaseGuild'];
  guild: Leveling['getDiscordGuild'];
}

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

export default function GuildLeveling({ db, guild }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { addChange, updateGuild, changes, updateSelectedOption } = useContext(GuildContext);
  const { authenticated } = useContext(UserContext);
  const router = useRouter();
  const [levels, setLevels] = useState(db?.levels);

  useEffect(() => {
    if (!authenticated && guild) {
      void router.push(`/guilds/${guild.id}`);
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

  updateSelectedOption('leveling');
  updateGuild(guild.id);

  return (
    <Base guild={guild} option="leveling">
      <div>
        <label htmlFor="levels">Levels</label>
        <input checked={changes.levels ?? levels} onChange={handleLevelsChange} id="levels" type="checkbox" />
      </div>

      {/* <label htmlFor="xpRoles">No XP Roles</label> */}
      {/* <Select data={guild.roles.map(({ color, id, name }) => ({ color, label: name, value: id }))} /> */}

      <p>{JSON.stringify(changes)}</p>
    </Base>
  );
}
