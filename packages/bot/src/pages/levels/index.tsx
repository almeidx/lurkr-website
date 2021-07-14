import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import Input from '../../components/form/Input';
import Guild from '../../components/Guild';
import { initializeApollo } from '../../graphql/client';
import USER_GUILDS, { UserGuilds, UserGuildsVariables } from '../../graphql/queries/UserGuilds';
import { isValidSnowflake } from '../../utils/utils';

export const getServerSideProps: GetServerSideProps<{ guilds: UserGuilds['getUserGuilds'] }> = async (ctx) => {
  ctx.req.headers.accept = '';

  const apolloClient = initializeApollo(null, ctx.req.headers);

  const { data } = await apolloClient.query<UserGuilds, UserGuildsVariables>({
    query: USER_GUILDS,
    variables: { withPermissions: false },
  });

  return {
    props: {
      guilds: data.getUserGuilds ? [...data.getUserGuilds].sort((a, b) => a.name.localeCompare(b.name)) : null,
    },
  };
};

export default function Levels({ guilds }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [serverId, setServerId] = useState<string>('');
  const submitRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    window.scroll({ behavior: 'auto', left: 0, top: 0 });
  }, []);

  let timeout: NodeJS.Timeout | null = null;

  const handleServerIdSubmit = () => {
    if (!isValidSnowflake(serverId)) {
      if (submitRef.current) submitRef.current.style.color = '#ff0000';

      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (submitRef.current) submitRef.current.style.color = '#fff';
      }, 1_000);
    } else {
      void router.push(`/levels/${serverId}`);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-center min-h-screen bg-discord-dark gap-y-8">
      <Head>
        <title>Levels | Pepe Manager</title>
      </Head>

      {guilds && (
        <>
          <h1>Pick a server to view the levels of</h1>
          <main className="flex flex-row flex-wrap justify-center items-start gap-6 max-w-7xl">
            {guilds.map(({ icon, id, name }) => (
              <Guild baseRedirectPath="/levels/" icon={icon} id={id} key={id} name={name} />
            ))}
          </main>
        </>
      )}

      <div className="px-4 w-full flex items-center justify-center text-center flex-col">
        <h1>{guilds ? 'Alternatively, enter a server ID' : 'Enter the ID of the server you want to view'}</h1>
        <div className="w-full sm:w-8/12 md:w-6/12 lg:w-4/12">
          <Input
            className="my-5"
            id="searchTerm"
            initialValue={''}
            maxLength={20}
            onChange={(t) => (t ? /^\d+$/.test(t) && setServerId(t) : setServerId(t))}
            onSubmit={handleServerIdSubmit}
            placeholder="Enter a server ID"
            submitRef={submitRef}
          />
        </div>
      </div>
    </div>
  );
}
