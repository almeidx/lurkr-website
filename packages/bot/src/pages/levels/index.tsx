import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import Input from '../../components/form/Input';
import { initializeApollo } from '../../graphql/client';
import USER_GUILDS, { UserGuilds, UserGuildsVariables } from '../../graphql/queries/UserGuilds';
import { guildIconCdn } from '../../utils/cdn';
import { FALLBACK_AVATAR_PATH } from '../../utils/constants';
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
    window.scroll({
      behavior: 'auto',
      left: 0,
      top: 0,
    });
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
    <div className="flex flex-col justify-center items-center min-h-screen bg-discord-dark gap-y-8">
      <Head>
        <title>Levels | Pepe Manager</title>
      </Head>

      {guilds && (
        <>
          <h1>Pick a server to view the levels of</h1>
          <main className="flex flex-row flex-wrap justify-center items-start gap-6 max-w-7xl">
            {guilds.map(({ icon, id, name }) => (
              <Link href={`/levels/${id}`} key={id}>
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
        </>
      )}

      <div className="w-full sm:w-8/12 md:w-6/12 lg:w-4/12 px-4">
        <h1 className="text-center">
          {guilds ? 'Alternatively, enter a server ID' : 'Enter the ID of the server you want to view'}
        </h1>
        <Input
          className="my-5"
          id="searchTerm"
          maxLength={20}
          onChange={(e) =>
            e.target.value ? /^[\d]+$/.test(e.target.value) && setServerId(e.target.value) : setServerId(e.target.value)
          }
          onClear={() => setServerId('')}
          onSubmit={handleServerIdSubmit}
          placeholder="Enter a server ID"
          submitRef={submitRef}
          value={serverId}
        />
      </div>
    </div>
  );
}
