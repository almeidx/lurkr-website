import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { fetchQuery } from 'relay-runtime';

import type { UserGuildsQuery, UserGuildsQueryResponse } from '../../__generated__/UserGuildsQuery.graphql';
import Input from '../../components/form/Input';
import Guild from '../../components/Guild';
import UserGuilds from '../../graphql/queries/UserGuilds';
import environment from '../../relay/environment';
import { CorrectSnowflakeTypes, DeepMutable, isValidSnowflake, removeNonStringValues } from '../../utils/utils';

type Guilds = CorrectSnowflakeTypes<DeepMutable<UserGuildsQueryResponse['getUserGuilds']>>;

export const getServerSideProps: GetServerSideProps<{ guilds: Guilds }> = async (ctx) => {
  const env = environment(undefined, removeNonStringValues(ctx.req.headers));
  const data = await fetchQuery<UserGuildsQuery>(env, UserGuilds, { withPermissions: false }).toPromise();
  if (!data) return { notFound: true };

  return {
    props: {
      guilds: data.getUserGuilds
        ? ([...data.getUserGuilds] as Exclude<Guilds, null>).sort((a, b) => a.name.localeCompare(b.name))
        : null,
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
      if (submitRef.current) submitRef.current.style.color = '#ed4245';

      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (submitRef.current) submitRef.current.style.color = '#fff';
      }, 1_000);
    } else {
      void router.push(`/levels/${serverId}`);
    }
  };

  return (
    <div className="flex flex-col gap-y-8 justify-center items-center min-h-screen-no-footer text-center bg-discord-dark">
      <Head>
        <title>Levels | Pepe Manager</title>
      </Head>

      {guilds && (
        <>
          <h1>Pick a server to view the levels of</h1>
          <main className="flex flex-row flex-wrap gap-6 justify-center items-start max-w-7xl">
            {guilds.map(({ icon, id, name }) => (
              <Guild baseRedirectPath="/levels/" icon={icon} id={id} key={id} name={name} />
            ))}
          </main>
        </>
      )}

      <div className="flex flex-col justify-center items-center px-4 w-full text-center">
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
