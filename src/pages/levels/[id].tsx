import { TailSpin } from '@agney/react-loading';
import axios from 'axios';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Level, { Colours, LevelInfo, LevelRoles } from '../../components/Level';
import Role from '../../components/Role';
import styles from '../../styles/pages/Leaderboard.module.css';
import { API_BASE_URL, DISCORD_GUILD_CDN, FALLBACK_AVATAR } from '../../utils/constants';

interface Levels {
  guild: {
    icon: string | null;
    id: string;
    name: string;
  };
  levels: LevelInfo[];
  roles: LevelRoles[] | null;
}

export default function Leaderboard({ data }: { data: Levels }) {
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
        <title>{data.guild.name} Leaderboard | Pepe Manager</title>
      </Head>

      <header>
        <img
          src={DISCORD_GUILD_CDN(data.guild.id, data.guild.icon) ?? FALLBACK_AVATAR}
          alt={`${data.guild.name} server icon`}
        />
        <span>{data.guild.name}</span>
      </header>

      <main>
        <div className={styles.leaderboardContainer}>
          {data.levels.map(({ avatar, level, tag, userID, xp }, i) => (
            <Level
              key={userID}
              avatar={avatar}
              colour={resolveUserColour(i)}
              index={i}
              level={level}
              tag={tag}
              totalLevels={data.levels.length}
              userID={userID}
              xp={xp}
            />
          ))}
        </div>

        {data.roles && (
          <div className={styles.xpRolesContainer}>
            <span>XP Roles</span>

            <hr />

            {data.roles
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (typeof params?.id !== 'string') return { notFound: true };

  try {
    const { data, status } = await axios.get<Levels>(`/levels/${params.id}`, { baseURL: API_BASE_URL });
    if (status !== 200) return { notFound: true };

    return {
      props: {
        data,
      },
      revalidate: 60,
    };
  } catch (err) {
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
