import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { lazy, Suspense, useContext, useEffect, useMemo } from 'react';
import { BsFillShiftFill } from 'react-icons/bs';
import { ImCog } from 'react-icons/im';
import { RiShieldUserLine } from 'react-icons/ri';

import Menu, { isValidSection } from '../../components/dashboard/Menu';
import Failure from '../../components/Failure';
import Spinner from '../../components/Spinner';
import { GuildContext } from '../../contexts/GuildContext';
import { UserContext } from '../../contexts/UserContext';
import { initializeApollo } from '../../graphql/client';
import DASHBOARD_GUILD, { DashboardGuild, DashboardGuildVariables } from '../../graphql/queries/DashboardGuild';
import { isValidSnowflake } from '../../utils/utils';

const General = lazy(() => import('../../components/dashboard/pages/General'));
const Autorole = lazy(() => import('../../components/dashboard/pages/Autorole'));
const Leveling = lazy(() => import('../../components/dashboard/pages/Leveling'));
const Milestones = lazy(() => import('../../components/dashboard/pages/Milestones'));
const EmojiList = lazy(() => import('../../components/dashboard/pages/EmojiList'));
const MentionCooldown = lazy(() => import('../../components/dashboard/pages/MentionCooldown'));
const Miscellaneous = lazy(() => import('../../components/dashboard/pages/Miscellaneous'));

interface GuildProps {
  database: DashboardGuild['getDatabaseGuild'];
  guild: DashboardGuild['getDiscordGuild'];
}

export const getServerSideProps: GetServerSideProps<GuildProps> = async (ctx) => {
  if (typeof ctx.params?.id !== 'string' || !isValidSnowflake(ctx.params.id)) return { notFound: true };

  ctx.req.headers.accept = '';

  const apolloClient = initializeApollo(null, ctx.req.headers);

  const { data } = await apolloClient.query<DashboardGuild, DashboardGuildVariables>({
    query: DASHBOARD_GUILD,
    variables: { id: ctx.params.id, includeChannels: true },
  });

  return {
    props: {
      database: data.getDatabaseGuild,
      guild: data.getDiscordGuild,
    },
  };
};

export default function Guild({ database, guild }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { authenticated } = useContext(UserContext);
  const { section, updateData, updateGuildId, updateSection } = useContext(GuildContext);

  const sortedChannels = useMemo(
    () => [...(guild?.channels ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [guild],
  );
  const sortedRoles = useMemo(() => [...(guild?.roles ?? [])].sort((a, b) => b.position - a.position), [guild]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('p');
    if (query && guild) {
      const pageQuery = decodeURIComponent(query).toLowerCase();
      const pageName = isValidSection(pageQuery) ? pageQuery : 'general';
      void router.push(`/guilds/${guild.id}?p=${pageName}`, `/guilds/${guild.id}?p=${pageName}`, { shallow: true });
      updateSection(pageName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (guild) updateGuildId(guild.id);
    if (database) updateData(database);
  }, [database, guild, updateData, updateGuildId]);

  if (!authenticated) {
    return <Failure message="You need to sign in to view this page." />;
  }

  if (!guild) {
    return <Failure message="Could not find the guild you were trying to edit." />;
  }

  if (!database) {
    return <Failure message="Found the guild you were trying to edit, but couldn't find the database document." />;
  }

  return (
    <div className="w-full bg-discord-dark">
      <div className="max-w-[992px] xl:max-w-[1440px] mx-auto min-h-screen flex flex-col sm:flex-row divide-x-2 divide-gray-600">
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

        <main className="pb-5 px-4 md:pt-6 w-full">
          <Suspense
            fallback={
              <div className="min-h-screen bg-discord-dark flex justify-center items-center">
                <Spinner className="w-60 h-auto" />
              </div>
            }
          >
            {section === 'general' ? (
              <General channels={sortedChannels} database={database} />
            ) : section === 'autorole' ? (
              <Autorole database={database} roles={sortedRoles} />
            ) : section === 'leveling' ? (
              <Leveling channels={sortedChannels} database={database} roles={sortedRoles} />
            ) : section === 'milestones' ? (
              <Milestones channels={sortedChannels} database={database} roles={sortedRoles} />
            ) : section === 'emojiList' ? (
              <EmojiList channels={sortedChannels} database={database} />
            ) : section === 'mentionCooldown' ? (
              <MentionCooldown database={database} roles={sortedRoles} />
            ) : (
              <Miscellaneous channels={sortedChannels} database={database} />
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
