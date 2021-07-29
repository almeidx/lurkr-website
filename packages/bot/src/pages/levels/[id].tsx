import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { fetchQuery } from 'relay-runtime';

import type { GuildLevelsQuery } from '../../__generated__/GuildLevelsQuery.graphql';
import Failure from '../../components/Failure';
import Role from '../../components/leaderboard/Role';
import User from '../../components/leaderboard/User';
import Spinner from '../../components/Spinner';
import GuildLevels, { DiscordGuild, GuildLevelsUserInfo, Levels } from '../../graphql/queries/GuildLevels';
import environment from '../../relay/environment';
import { guildIconCdn } from '../../utils/cdn';
import { FALLBACK_AVATAR_PATH } from '../../utils/constants';
import { isValidSnowflake } from '../../utils/utils';

interface LeaderboardProps {
  guild: DiscordGuild;
  levels: GuildLevelsUserInfo[] | null;
  roles: Levels['roles'];
}

export const getStaticProps: GetStaticProps<LeaderboardProps> = async (ctx) => {
  if (typeof ctx.params?.id !== 'string' || !isValidSnowflake(ctx.params.id)) return { notFound: true };

  const env = environment();
  const data = await fetchQuery<GuildLevelsQuery>(env, GuildLevels, { id: ctx.params.id }).toPromise();
  if (!data) return { notFound: true };

  return {
    props: {
      guild: data.getDiscordGuild as DiscordGuild,
      levels: data.getGuildLevels ? ([...data.getGuildLevels.levels] as GuildLevelsUserInfo[]) : null,
      roles: data.getGuildLevels?.roles ? ([...data.getGuildLevels.roles] as Levels['roles']) : null,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => ({ fallback: true, paths: [] });

export default function Leaderboard({ guild, levels, roles }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return (
      <div className="min-h-screen bg-discord-dark flex justify-center items-center">
        <Spinner className="w-60 h-auto" />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!guild || !levels?.length) {
    return (
      <Failure message="The guild you're trying to view either does not have the leveling system enabled or has no leveling entries." />
    );
  }

  return (
    <div className="flex flex-col items-start min-h-screen bg-discord-dark sm:px-6 gap-y-10">
      <Head>
        <title>{guild.name} Leaderboard | Pepe Manager</title>
      </Head>

      <header className="flex flex-row justify-center items-center gap-6 ml-10 mt-3 sm:mt-10 xl:mt-0">
        {guild.icon ? (
          <img
            alt={`${guild.name} server icon`}
            className="rounded-md"
            height={64}
            src={guildIconCdn(guild.id, guild.icon, 64)}
            width={64}
          />
        ) : (
          <Image className="rounded-md" height={64} src={FALLBACK_AVATAR_PATH} width={64} />
        )}
        <p className="text-white text-xl sm:text-4xl font-bold">{guild.name}</p>
      </header>

      <main className="flex flex-col md:flex-row w-full my-4 justify-center sm:justify-between gap-y-6">
        <section className="w-full rounded-2xl bg-discord-not-quite-black divide-solid divide-gray-400 divide-y-2">
          {levels.map((user, i) => (
            <User {...user} index={i} key={user.userID} />
          ))}
        </section>

        {roles && (
          <div className="flex flex-col h-[fit-content] items-center bg-discord-not-quite-black mb-8 rounded-2xl pb-4 divide-solid divide-gray-400 divide-y-2 sm:ml-6">
            <span className="text-white whitespace-nowrap text-2xl font-medium mx-1 py-4">XP Roles</span>

            <div className="w-full flex flex-col max-w-lg rounded-lg">
              {roles
                .sort((a, b) => a.level - b.level)
                .map(({ level, roles: levelRoles }) => (
                  <Role key={level} level={level} roles={levelRoles} />
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
