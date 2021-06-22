import type { Snowflake } from 'discord-api-types';
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { ChangeEvent } from 'react';

import Spinner from '../../components/Spinner';
import { initializeApollo } from '../../graphql/client';
import GUILD_LEVELS, { GuildLevels, Levels } from '../../graphql/queries/GuildLevels';
import { FALLBACK_AVATAR_PATH } from '../../utils/constants';
import { isValidSnowflake } from '../../utils/utils';

interface LeaderboardProps {
  guild: GuildLevels['getDiscordGuild'];
  levels: Levels['levels'];
  roles: Levels['roles'];
}

const resolveColour = (colour: number) => (colour ? `#${colour.toString(16)}` : 'var(--discord-role)');

const makeGuildIconLink = (id: Snowflake, hash: string) =>
  `https://cdn.discordapp.com/icons/${id}/${hash}.${hash.startsWith('a_') ? 'gif' : 'webp'}?size=64`;

const makeUserAvatarLink = (id: Snowflake, hash: string | null, tag: string | null) =>
  hash
    ? `https://cdn.discordapp.com/avatars/${id}/${hash}.webp?size=64`
    : tag
    ? `https://cdn.discordapp.com/avatars/${Number(tag.split(/#(\d{4})$/)[1])}.webp?size=64`
    : FALLBACK_AVATAR_PATH;

export const getStaticProps: GetStaticProps<LeaderboardProps> = async (ctx) => {
  if (typeof ctx.params?.id !== 'string' || !isValidSnowflake(ctx.params.id)) return { notFound: true };

  const apolloClient = initializeApollo(null);

  const { data } = await apolloClient.query<GuildLevels>({
    query: GUILD_LEVELS,
    variables: { id: ctx.params.id, requireAuth: false },
  });

  if (!data.getDiscordGuild || !data.getGuildLevels) return { notFound: true };

  return {
    props: {
      guild: data.getDiscordGuild,
      levels: data.getGuildLevels.levels,
      roles: data.getGuildLevels.roles,
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

  if (!guild || !levels.length) {
    return (
      <div className="min-h-screen bg-discord-dark flex justify-center items-center">
        <h1 className="text-white font-bold text-center text-xl sm:text-3xl">
          The guild you&apos;re trying to view either doesn&apos;t exist or does not have the leveling system enabled.
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start min-h-screen bg-discord-dark sm:px-6 gap-y-10">
      <header className="flex flex-row justify-center items-center gap-6">
        {guild.icon ? (
          <img alt={`${guild.name} server icon`} height={64} src={makeGuildIconLink(guild.id, guild.icon)} width={64} />
        ) : (
          <Image height={64} src={FALLBACK_AVATAR_PATH} width={64} />
        )}
        <p className="text-white text-lg font-medium">{guild.name}</p>
      </header>

      <main className="flex flex-col sm:flex-row w-full my-4 justify-between">
        <section className="w-full rounded-2xl bg-discord-not-quite-black divide-solid divide-yellow-200 divide-y-2">
          {levels.map(({ avatar, level, tag, userID }, i) => (
            <div className="flex flex-row justify-between px-6 py-4 rounded-lg" key={userID}>
              <div className="flex flex-row justify-center items-center gap-6">
                <span className="text-white">{i + 1}</span>

                {avatar || tag ? (
                  <img
                    alt={`${tag} avatar`}
                    className="rounded-full"
                    height={64}
                    src={makeUserAvatarLink(userID, avatar, tag)}
                    width={64}
                    onError={(e: ChangeEvent<HTMLImageElement>) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_AVATAR_PATH;
                    }}
                  />
                ) : (
                  <Image className="rounded-full" height={64} src={FALLBACK_AVATAR_PATH} width={64} />
                )}

                <p className="text-gray-200">{tag ?? userID}</p>
              </div>

              <div className="flex justify-center items-center">
                <span className="text-white px-3 py-2 bg-blue-800 rounded-md">{level}</span>
              </div>
            </div>
          ))}
        </section>

        {roles && (
          <div
            className="flex flex-col h-[fit-content] items-center bg-discord-not-quite-black mr-8 mb-8 rounded-2xl pb-4"
            style={{ justifyContent: 'left' }}
          >
            <span className="text-white whitespace-nowrap text-xl font-medium mx-1">XP Roles</span>

            <hr />

            {roles
              .sort((a, b) => b.level - a.level)
              .map(({ level, roles: levelRoles }) => (
                <div className="flex flex-col gap-4" key={level}>
                  <span className="text-white">Level {level}</span>
                  <div className="flex flex-row gap-6">
                    {levelRoles.map(({ color, id, name }) => (
                      <span
                        className="rounded-lg px-1 py-0.5"
                        key={id}
                        style={{ border: `1px solid ${resolveColour(color)}`, color: resolveColour(color) }}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
