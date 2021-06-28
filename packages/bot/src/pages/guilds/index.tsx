import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';

import Failure from '../../components/Failure';
import { UserContext } from '../../contexts/UserContext';
import { initializeApollo } from '../../graphql/client';
import USER_GUILDS, { UserGuilds } from '../../graphql/queries/UserGuilds';
import { guildIconCdn } from '../../utils/cdn';
import { FALLBACK_AVATAR_PATH } from '../../utils/constants';

export const getServerSideProps: GetServerSideProps<{ guilds: UserGuilds['getUserGuilds'] }> = async (ctx) => {
  ctx.req.headers.accept = '';

  const apolloClient = initializeApollo(null, ctx.req.headers);

  const { data } = await apolloClient.query<UserGuilds>({
    query: USER_GUILDS,
    variables: { withPermissions: true },
  });

  return {
    props: {
      guilds: data.getUserGuilds ? [...data.getUserGuilds].sort((a, b) => a.name.localeCompare(b.name)) : null,
    },
  };
};

export default function Guild({ guilds }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { authenticated } = useContext(UserContext);

  if (!authenticated) {
    return <Failure message="You need to sign in to view this page." />;
  }

  if (!guilds) {
    return <Failure message="You are not the manager of any servers." />;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-discord-dark gap-y-8 pb-6 pt-6 sm:pt-0">
      <Head>
        <title>Guilds | Pepe Manager</title>
      </Head>

      <h1>Pick the server you would like to configure</h1>

      <main className="flex flex-row flex-wrap justify-center items-start gap-6 max-w-7xl">
        {guilds.map(({ icon, id, name }) => (
          <Link href={`/guilds/${id}`} key={id}>
            <a className="flex flex-col flex-wrap gap-2 px-6 py-4 bg-discord-slightly-darker rounded-2xl w-40 h-44 text-center relative">
              {icon ? (
                <img
                  alt={`${name} server icon`}
                  className="rounded-lg"
                  height={128}
                  src={guildIconCdn(id, icon, 128)}
                  width={128}
                />
              ) : (
                <Image className="rounded-lg" height={128} src={FALLBACK_AVATAR_PATH} width={128} />
              )}

              <span className="text-white w-[calc(100%-1rem)] absolute left-0 bottom-4 mx-2 truncate">{name}</span>
            </a>
          </Link>
        ))}
      </main>
    </div>
  );
}
