import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { initializeApollo } from '../../apollo/client';
import Level, { Colours } from '../../components/Level';
import Loading from '../../components/Loading';
import Role from '../../components/Role';
import GUILD_LEVELS, { Guild, GuildLevels, Levels } from '../../graphql/GuildLevels';
import styles from '../../styles/pages/levels/Leaderboard.module.css';
import { DISCORD_GUILD_CDN, FALLBACK_AVATAR } from '../../utils/constants';

interface LeaderboardProps {
  guild: Guild;
  levels: Levels['levels'];
  roles: Levels['roles'] | null;
}

export const getStaticProps: GetStaticProps<LeaderboardProps> = async ({ params }) => {
  if (typeof params?.id !== 'string') return { notFound: true };

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query<GuildLevels>({
    query: GUILD_LEVELS,
    variables: { id: params.id },
  });

  if (!data.getDiscordGuild || !data.getGuildLevels) return { notFound: true };

  return {
    props: {
      guild: data.getDiscordGuild,
      levels: data.getGuildLevels.levels,
      roles: data.getGuildLevels.roles ?? null,
    },
    revalidate: 60,
  };
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: true,
    paths: [],
  };
};

export default function Leaderboard({ guild, levels, roles }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <Loading />;
  }

  function resolveUserColour(index: number) {
    return index === 0 ? Colours.GOLD : index === 1 ? Colours.SILVER : index === 2 ? Colours.BRONZE : Colours.REST;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{guild.name} Leaderboard | Pepe Manager</title>
      </Head>

      <header>
        <img src={DISCORD_GUILD_CDN(guild.id, guild.icon) ?? FALLBACK_AVATAR} alt={`${guild.name} server icon`} />
        <span>{guild.name}</span>
      </header>

      <main>
        <div className={styles.leaderboardContainer}>
          {levels.map(({ avatar, level, tag, userID, xp }, i) => (
            <Level
              key={userID}
              avatar={avatar}
              colour={resolveUserColour(i)}
              index={i}
              level={level}
              tag={tag}
              totalLevels={levels.length}
              userID={userID}
              xp={xp}
            />
          ))}
        </div>

        {roles && (
          <div className={styles.xpRolesContainer}>
            <span>XP Roles</span>

            <hr />

            {roles
              .sort((a, b) => b.level - a.level)
              .map(({ level, roles: levelRoles }) => (
                <Role key={level} level={level} roles={levelRoles} />
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
