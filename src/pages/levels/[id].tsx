import type { Snowflake } from 'discord-api-types/globals';
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { fetchQuery } from 'relay-runtime';

import type { GuildLevelsQuery } from '../../__generated__/GuildLevelsQuery.graphql';
import Failure from '../../components/Failure';
import Multiplier from '../../components/leaderboard/Multiplier';
import Role from '../../components/leaderboard/Role';
import User from '../../components/leaderboard/User';
import Spinner from '../../components/Spinner';
import type { Multiplier as IMultiplier } from '../../graphql/queries/DashboardGuild';
import GuildLevels, { Channel, DiscordGuild, GuildLevelsUserInfo, Levels } from '../../graphql/queries/GuildLevels';
import environment from '../../relay/environment';
import { guildIconCdn } from '../../utils/cdn';
import { FALLBACK_AVATAR_PATH } from '../../utils/constants';
import { isValidSnowflake } from '../../utils/utils';

interface LeaderboardProps {
  channels: Channel[] | null;
  guild: DiscordGuild;
  guildId: Snowflake;
  levels: GuildLevelsUserInfo[] | null;
  multipliers: IMultiplier[] | null;
  roles: Levels['roles'];
}

export const getStaticProps: GetStaticProps<LeaderboardProps> = async (ctx) => {
  if (typeof ctx.params?.id !== 'string' || !isValidSnowflake(ctx.params.id)) return { notFound: true };

  const env = environment();
  const data = await fetchQuery<GuildLevelsQuery>(env, GuildLevels, { id: ctx.params.id }).toPromise();
  if (!data) return { notFound: true };

  return {
    props: {
      channels: data.getDiscordGuildChannels ? [...(data.getDiscordGuildChannels as Channel[])] : null,
      guild: data.getDiscordGuild as DiscordGuild,
      guildId: ctx.params.id,
      levels: data.getGuildLevels ? ([...data.getGuildLevels.levels] as GuildLevelsUserInfo[]) : null,
      multipliers: data.getGuildLevels?.multipliers ? [...(data.getGuildLevels.multipliers as IMultiplier[])] : null,
      roles: data.getGuildLevels?.roles ? ([...data.getGuildLevels.roles] as Levels['roles']) : null,
    },
    revalidate: 180,
  };
};

export const getStaticPaths: GetStaticPaths = () => ({ fallback: true, paths: [] });

export default function Leaderboard({
  channels,
  guild,
  guildId,
  levels,
  multipliers,
  roles,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return (
      <div className="flex justify-center items-center min-h-screen-no-footer bg-discord-dark">
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
    <div className="flex flex-col gap-y-10 items-start min-h-screen-no-footer bg-discord-dark sm:px-6">
      <Head>
        <title>{guild.name} Leaderboard | Pepe Manager</title>
      </Head>

      <header className="flex flex-row gap-6 justify-center items-center mt-3 ml-10 sm:mt-10 xl:mt-0">
        {guild.icon ? (
          <img
            alt={`${guild.name} server icon`}
            className="rounded-md"
            height={64}
            src={guildIconCdn(guildId, guild.icon, 64)}
            width={64}
          />
        ) : (
          <Image className="rounded-md" height={64} src={FALLBACK_AVATAR_PATH} width={64} />
        )}
        <p className="text-xl font-bold text-white sm:text-4xl">{guild.name}</p>
      </header>

      <main className="flex flex-col gap-y-6 justify-center my-4 w-full sm:justify-between md:flex-row">
        <section className="w-full h-[fit-content] bg-discord-not-quite-black rounded-2xl divide-y-2 divide-gray-400 divide-solid">
          {levels.map((user, i) => (
            <User {...user} index={i} key={user.userID} />
          ))}
        </section>

        {(roles || !!multipliers?.length) && (
          <div className="flex flex-col gap-4 items-center mb-8 sm:ml-6">
            {roles && (
              <div className="flex flex-col items-center pb-4 min-w-[15rem] max-w-[23rem] h-[fit-content] bg-discord-not-quite-black rounded-2xl divide-y-2 divide-gray-400 divide-solid">
                <span className="py-3 mx-1 text-2xl font-medium text-white whitespace-nowrap">XP Roles</span>

                <div className="flex flex-col w-full max-w-lg rounded-lg">
                  {roles
                    .sort((a, b) => a.level - b.level)
                    .map(({ level, roles: levelRoles }) => (
                      <Role key={level} level={level} roles={levelRoles} />
                    ))}
                </div>
              </div>
            )}

            {!!multipliers?.length && (
              <div className="flex flex-col items-center pb-4 min-w-[15rem] max-w-[23rem] h-[fit-content] bg-discord-not-quite-black rounded-2xl divide-y-2 divide-gray-400 divide-solid">
                <span className="py-3 mx-1 text-2xl font-medium text-white whitespace-nowrap">XP Multipliers</span>

                <div className="flex flex-col w-full max-w-lg rounded-lg">
                  {multipliers
                    .filter(({ type }) => (type === 'role' ? !!guild.roles : type === 'channel' ? !!channels : true))
                    .sort((a, b) => a.multiplier - b.multiplier)
                    .map(({ _id, multiplier, targets, type }) => (
                      <Multiplier
                        key={_id}
                        items={type === 'role' ? guild.roles : type === 'channel' ? channels : null}
                        multiplier={multiplier}
                        targets={targets}
                        type={type}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
