import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useContext, useMemo } from 'react';
import { BsFillShiftFill } from 'react-icons/bs';
import { ImCog } from 'react-icons/im';
import { RiShieldUserLine } from 'react-icons/ri';

import Menu from '../../../components/dashboard/Menu';
import Autorole from '../../../components/dashboard/pages/Autorole';
import General from '../../../components/dashboard/pages/General';
import Leveling from '../../../components/dashboard/pages/Leveling';
import Failure from '../../../components/Failure';
import { GuildChangesContext } from '../../../contexts/GuildChangesContext';
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
    variables: { id: ctx.params.id, includeChannels: true, withPermissions: true },
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
  const { section } = useContext(GuildChangesContext);

  const memoizedSortedChannels = useMemo(
    () => [...(guild?.channels ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [guild],
  );

  const memoizedSortedRoles = useMemo(() => [...(guild?.roles ?? [])].sort((a, b) => b.position - a.position), [guild]);

  if (!authenticated) {
    return <Failure message="You need to sign in to view this page." />;
  }

  if (!guild) {
    return <Failure message="Could not find the guild you were trying to edit." />;
  }

  return (
    <div className="bg-discord-dark min-h-screen flex flex-col sm:flex-row divide-x-2 divide-gray-600">
      <Head>
        <title>{guild.name} Dashboard | Pepe Manager</title>
      </Head>

      <Menu guild={guild} />

      <div className="flex sm:hidden justify-center bg-discord-slightly-darker h-16 mb-4 px-2 text-white">
        <div className="px-10 py-5">
          <ImCog className="h-6 w-6 fill-current" />
        </div>
        <div className="px-10 py-5">
          <BsFillShiftFill className="h-6 w-6 fill-current" />
        </div>
        <div className="px-10 py-5">
          <RiShieldUserLine className="h-6 w-6 fill-current" />
        </div>
      </div>

      <main className="pt-5 px-4 w-full">
        {section === 'general' ? (
          <General channels={memoizedSortedChannels} database={database} />
        ) : section === 'autorole' ? (
          <Autorole database={database} roles={memoizedSortedRoles} />
        ) : (
          <Leveling channels={memoizedSortedChannels} database={database} roles={memoizedSortedRoles} />
        )}
      </main>
    </div>
  );
}
