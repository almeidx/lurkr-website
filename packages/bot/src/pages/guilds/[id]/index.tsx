import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { ChangeEvent, useCallback, useContext, useState } from 'react';

import Header from '../../../components/dashboard/Header';
import Menu from '../../../components/dashboard/Menu';
import Failure from '../../../components/Failure';
import Input from '../../../components/Input';
import { UserContext } from '../../../contexts/UserContext';
import { initializeApollo } from '../../../graphql/client';
import USER_GUILD, { UserGuild } from '../../../graphql/queries/UserGuild';
import { isValidSnowflake } from '../../../utils/utils';

interface GuildProps {
  database: UserGuild['getDatabaseGuild'];
  guild: UserGuild['getDiscordGuild'];
}

export const getServerSideProps: GetServerSideProps<GuildProps> = async (ctx) => {
  if (typeof ctx.params?.id !== 'string' || !isValidSnowflake(ctx.params.id)) return { notFound: true };

  ctx.req.headers.accept = '';

  const apolloClient = initializeApollo(null, ctx.req.headers);

  const { data } = await apolloClient.query<UserGuild>({
    query: USER_GUILD,
    variables: { id: ctx.params.id, withPermissions: true },
  });

  return {
    props: {
      database: data.getDatabaseGuild,
      guild: data.getDiscordGuild,
    },
  };
};

export default function Guild({ database, guild }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { authenticated } = useContext(UserContext);
  const [prefix, setPrefix] = useState(database?.prefix ?? 'p!');

  const handlePrefixChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.length <= 5) {
      setPrefix(value);
    }
  }, []);

  if (!authenticated) {
    return <Failure message="You need to sign in to view this page." />;
  }

  if (!guild) {
    return <Failure message="Could not find the guild you were trying to edit." />;
  }

  return (
    <div className="bg-discord-dark min-h-screen flex flex-row divide-x-2 divide-gray-600">
      <Head>
        <title>{guild.name} Dashboard | Pepe Manager</title>
      </Head>

      <Menu guild={guild} />

      <main className="pl-8 pt-5 w-full">
        <Header description="This panel controls the bot in your server." title="Settings" />

        <div className="flex flex-col bg-discord-slightly-darker rounded-xl w-full px-8 py-7">
          <div className="flex flex-col gap-3">
            <label className="text-gray-300" htmlFor="prefix">
              Bot Prefix
            </label>

            <Input
              id="prefix"
              maxLength={5}
              onChange={handlePrefixChange}
              onClear={() => setPrefix('')}
              placeholder="Enter the bot prefix"
              value={prefix}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
