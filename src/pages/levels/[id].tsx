import { TailSpin } from '@agney/react-loading';
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Level, { Colours, LevelInfo, LevelRoles } from '../../components/Level';
import Role from '../../components/Role';
import api from '../../services/api';
import styles from '../../styles/pages/Leaderboard.module.css';
import { DISCORD_GUILD_CDN, FALLBACK_AVATAR } from '../../utils/constants';

interface Levels {
  guild: {
    icon: string | null;
    id: string;
    name: string;
  };
  levels: LevelInfo[];
  roles: LevelRoles[] | null;
}

export const getStaticProps: GetStaticProps<{ levels: Levels }> = async ({ params }) => {
  if (typeof params?.id !== 'string') return { notFound: true };

  try {
    const { data: levels, status } = await api.get<Levels>(`/levels/${params.id}`);
    if (status !== 200) return { notFound: true };

    return {
      props: {
        levels,
      },
      revalidate: 60,
    };
  } catch {
    return { notFound: true };
  }
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: true,
    paths: [],
  };
};

export default function Leaderboard({ levels }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return (
      <div className={styles.loadingContainer}>
        <TailSpin width="128px" height="128px" />
      </div>
    );
  }

  function resolveUserColour(index: number) {
    return index === 0 ? Colours.GOLD : index === 1 ? Colours.SILVER : index === 2 ? Colours.BRONZE : Colours.REST;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{levels.guild.name} Leaderboard | Pepe Manager</title>
      </Head>

      <header>
        <img
          src={DISCORD_GUILD_CDN(levels.guild.id, levels.guild.icon) ?? FALLBACK_AVATAR}
          alt={`${levels.guild.name} server icon`}
        />
        <span>{levels.guild.name}</span>
      </header>

      <main>
        <div className={styles.leaderboardContainer}>
          {levels.levels.map(({ avatar, level, tag, userID, xp }, i) => (
            <Level
              key={userID}
              avatar={avatar}
              colour={resolveUserColour(i)}
              index={i}
              level={level}
              tag={tag}
              totalLevels={levels.levels.length}
              userID={userID}
              xp={xp}
            />
          ))}
        </div>

        {levels.roles && (
          <div className={styles.xpRolesContainer}>
            <span>XP Roles</span>

            <hr />

            {levels.roles
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
