import type { Snowflake } from 'discord-api-types/globals';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Suspense, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchQuery } from 'relay-runtime';

import type { DashboardGuildQuery } from '../../__generated__/DashboardGuildQuery.graphql';
import Menu, { isValidSection } from '../../components/dashboard/Menu';
import Failure from '../../components/Failure';
import Message from '../../components/Message';
import Spinner from '../../components/Spinner';
import { GuildContext } from '../../contexts/GuildContext';
import { UserContext } from '../../contexts/UserContext';
import DashboardGuild, {
  DashboardChannels,
  DashboardDatabaseGuild,
  DashboardDiscordGuild,
} from '../../graphql/queries/DashboardGuild';
import environment from '../../relay/environment';
import { isValidSnowflake, removeNonStringValues } from '../../utils/utils';

const General = dynamic(() => import('../../components/dashboard/pages/General'), { suspense: true });
const Autorole = dynamic(() => import('../../components/dashboard/pages/Autorole'), { suspense: true });
const Leveling = dynamic(() => import('../../components/dashboard/pages/Leveling'), { suspense: true });
const Milestones = dynamic(() => import('../../components/dashboard/pages/Milestones'), { suspense: true });
const EmojiList = dynamic(() => import('../../components/dashboard/pages/EmojiList'), { suspense: true });
const MentionCooldown = dynamic(() => import('../../components/dashboard/pages/MentionCooldown'), { suspense: true });
const Miscellaneous = dynamic(() => import('../../components/dashboard/pages/Miscellaneous'), { suspense: true });

interface GuildProps {
  channels: DashboardChannels | null;
  database: DashboardDatabaseGuild | null;
  guild: DashboardDiscordGuild | null;
  guildId: Snowflake;
}

export const getServerSideProps: GetServerSideProps<GuildProps> = async (ctx) => {
  if (typeof ctx.params?.id !== 'string' || !isValidSnowflake(ctx.params.id)) return { notFound: true };

  const env = environment(undefined, removeNonStringValues(ctx.req.headers));
  const data = await fetchQuery<DashboardGuildQuery>(env, DashboardGuild, { id: ctx.params.id }).toPromise();
  if (!data) return { notFound: true };

  return {
    props: {
      channels: data.getDiscordGuildChannels as DashboardChannels,
      database: data.getDatabaseGuild as DashboardDatabaseGuild,
      guild: data.getDiscordGuild as DashboardDiscordGuild,
      guildId: ctx.params.id,
    },
  };
};

export default function Guild({
  channels,
  database,
  guild,
  guildId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [menuOpen, setMenuOpen] = useState<boolean>(true);
  const { changes, errors, section, updateData, updateGuildId, updateSection, warnings } = useContext(GuildContext);
  const { authenticated } = useContext(UserContext);
  const router = useRouter();

  const closeMenu = useCallback((): void => setMenuOpen(false), []);
  const openMenu = useCallback((): void => setMenuOpen(true), []);

  const sortedChannels = useMemo(() => [...(channels ?? [])].sort((a, b) => a.name.localeCompare(b.name)), [channels]);
  const sortedRoles = useMemo(() => [...(guild?.roles ?? [])].sort((a, b) => b.position - a.position), [guild]);

  useEffect(() => {
    if (!Object.keys(changes).length) return;

    const handleUnload = (event: BeforeUnloadEvent) => (event.returnValue = 'Changes that you made may not be saved.');

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [changes]);

  useEffect(() => {
    const pageQuery = String(router.query.p);

    if (pageQuery && pageQuery !== section) {
      const pageName = isValidSection(pageQuery) ? pageQuery : 'general';
      console.log("Found initial dashboard page '%s'", pageName);
      void router.push(`/guilds/${guildId}?p=${pageName}`, `/guilds/${guildId}?p=${pageName}`, { shallow: true });
      updateSection(pageName);
      closeMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (guild) updateGuildId(guildId);
    if (database) updateData(database);
  }, [database, guild, guildId, updateData, updateGuildId]);

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
      <div className="flex flex-col mx-auto max-w-[992px] min-h-screen-no-footer divide-gray-600 sm:flex-row sm:divide-x-2 xl:max-w-[1440px]">
        <Head>
          <title>{guild.name} Dashboard | Pepe Manager</title>
        </Head>

        <Menu closeMenu={closeMenu} guild={guild} guildId={guildId} menuOpen={menuOpen} premium={database.premium} />

        <main className={`pb-5 px-4 md:pt-6 w-full ${menuOpen ? 'hidden' : 'block'} sm:block`}>
          {warnings.length > 0 || errors.length > 0 ? (
            <div className="flex flex-col gap-3 mb-2">
              {errors.length > 0 && errors.map((m, i) => <Message key={i} message={m} />)}
              {warnings.length > 0 && warnings.map((m, i) => <Message key={i} message={m} type="warning" />)}
            </div>
          ) : null}

          <Suspense
            fallback={
              <div className="flex justify-center items-center min-h-screen-no-footer bg-discord-dark">
                <Spinner className="w-60 h-auto" />
              </div>
            }
          >
            {section === 'autorole' ? (
              <Autorole openMenu={openMenu} database={database} roles={sortedRoles} />
            ) : section === 'leveling' ? (
              <Leveling openMenu={openMenu} channels={sortedChannels} database={database} roles={sortedRoles} />
            ) : section === 'milestones' ? (
              <Milestones openMenu={openMenu} channels={sortedChannels} database={database} roles={sortedRoles} />
            ) : section === 'emojiList' ? (
              <EmojiList openMenu={openMenu} channels={sortedChannels} database={database} />
            ) : section === 'mentionCooldown' ? (
              <MentionCooldown openMenu={openMenu} database={database} roles={sortedRoles} />
            ) : section === 'miscellaneous' ? (
              <Miscellaneous openMenu={openMenu} channels={sortedChannels} database={database} />
            ) : (
              <General openMenu={openMenu} channels={sortedChannels} database={database} />
            )}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
