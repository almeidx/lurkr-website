import type { Snowflake } from 'discord-api-types';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { initializeApollo } from '../../graphql/client';
import USER_GUILDS, { UserGuilds } from '../../graphql/queries/UserGuilds';

export const getServerSideProps: GetServerSideProps<{ guilds: UserGuilds['getUserGuilds'] }> = async (ctx) => {
  ctx.req.headers.accept = '';

  const apolloClient = initializeApollo(null, ctx.req.headers);

  const { data } = await apolloClient.query<UserGuilds>({
    query: USER_GUILDS,
    variables: { withPermissions: false },
  });

  return {
    props: {
      guilds: data.getUserGuilds ? [...data.getUserGuilds].sort((a, b) => a.name.localeCompare(b.name)) : null,
    },
  };
};

const resolveGuildIcon = (id: Snowflake, hash: string) =>
  `https://cdn.discordapp.com/icons/${id}/${hash}.${hash.startsWith('a_') ? 'gif' : 'webp'}?size=128`;

export default function Levels({ guilds }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [serverId, setServerId] = useState<string>('');

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-discord-dark gap-y-8">
      {guilds && (
        <>
          <h1 className="text-white font-bold text-2xl md:text-4xl text-center">Pick a server to view the levels of</h1>
          <main className="flex flex-row flex-wrap justify-center items-start gap-6 max-w-7xl">
            {guilds.map(({ icon, id, name }) => (
              <Link href={`/levels/${id}`} key={id}>
                <a className="flex flex-col flex-wrap gap-2 px-6 py-4 bg-discord-slightly-darker rounded-2xl w-40 h-44 text-center relative">
                  {icon ? (
                    <img
                      alt={`${name} server icon`}
                      className="rounded-lg"
                      height={128}
                      src={resolveGuildIcon(id, icon)}
                      width={128}
                    />
                  ) : (
                    <Image className="rounded-lg" height={128} src="/static/fallback-avatar.png" width={128} />
                  )}

                  <span className="text-white w-[calc(100%-1rem)] absolute left-0 bottom-4 mx-2 truncate">{name}</span>
                </a>
              </Link>
            ))}
          </main>
        </>
      )}

      <h1 className="text-white font-bold text-center text-2xl md:text-4xl">
        {guilds ? 'Alternatively, enter a server ID' : 'Enter the ID of the server you want to view'}
      </h1>

      <div className="relative flex justify-center items-center my-5 w-1/4 min-w-max h-12">
        <input
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          autoFocus
          className="text-white bg-discord-not-quite-black px-5 py-3 focus:outline-none rounded-md shadow w-full"
          id="searchTerm"
          maxLength={20}
          onChange={(e) =>
            e.target.value ? /^[\d]+$/.test(e.target.value) && setServerId(e.target.value) : setServerId(e.target.value)
          }
          placeholder="Enter a server ID"
          type="text"
          value={serverId}
        />

        {serverId && (
          <label
            className="absolute right-0 min-w-max my-auto mx-4 text-2xl text-discord-red active:text-red-600 transition-colors h-full cursor-pointer"
            onClick={() => setServerId('')}
          >
            <span className="inline-block align-middle h-10 leading-10">x</span>
          </label>
        )}
      </div>
    </div>
  );
}
