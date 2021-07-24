import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useContext } from 'react';

import Failure from '../../components/Failure';
import Guild from '../../components/Guild';
import { UserContext } from '../../contexts/UserContext';
import { initializeApollo } from '../../graphql/client';
import USER_GUILDS, { UserGuilds, UserGuildsVariables } from '../../graphql/queries/UserGuilds';

export const getServerSideProps: GetServerSideProps<{ guilds: UserGuilds['getUserGuilds'] }> = async (ctx) => {
  ctx.req.headers.accept = '';

  const apolloClient = initializeApollo(null, ctx.req.headers);

  const { data } = await apolloClient.query<UserGuilds, UserGuildsVariables>({
    query: USER_GUILDS,
    variables: { withPermissions: true },
  });

  return {
    props: {
      guilds: data.getUserGuilds ? [...data.getUserGuilds].sort((a, b) => a.name.localeCompare(b.name)) : null,
    },
  };
};

export default function Guilds({ guilds }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { authenticated } = useContext(UserContext);

  if (!authenticated) {
    return <Failure message="You need to sign in to view this page." />;
  }

  if (!guilds) {
    return <Failure message="You are not the manager of any servers." />;
  }

  return (
    <div className="flex flex-col justify-center items-center text-center min-h-screen bg-discord-dark gap-y-8 pb-6 pt-6 sm:pt-0">
      <Head>
        <title>Guilds | Pepe Manager</title>
      </Head>

      <h1>Pick the server you would like to configure</h1>

      <main className="flex flex-row flex-wrap justify-center items-start gap-6 max-w-7xl">
        {guilds.map(({ icon, id, name }) => (
          <Guild baseRedirectPath="/guilds/" icon={icon} id={id} key={id} name={name} />
        ))}
      </main>
    </div>
  );
}
