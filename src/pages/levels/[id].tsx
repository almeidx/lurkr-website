import axios from 'axios';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Level, { Colours, LevelInfo } from '../../components/Level';
import styles from '../../styles/pages/Leaderboard.module.css';
import { API_BASE_URL } from '../../utils/constants';

interface Levels {
  guild: {
    icon: string;
    name: string;
  };
  levels: LevelInfo[];
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
    paths: [{ params: { id: '493351982887862283' } }],
  };
};

export default function Leaderboard({ data }: { data: Levels }) {
  const { isFallback } = useRouter();

  if (isFallback) return <h1>Loading...</h1>;

  function resolveUserColour(index: number) {
    return index === 0 ? Colours.GOLD : index === 1 ? Colours.SILVER : index === 2 ? Colours.BRONZE : Colours.REST;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{data.guild.name} Leaderboard | Pepe Manager</title>
      </Head>

      <header>
        <img src={data.guild.icon} alt={`${data.guild.name} server icon`} />
        <span>{data.guild.name}</span>
      </header>

      <main>
        <div className={styles.leaderboardContainer}>
          {data.levels.map(({ avatar, level, tag, userID, xp }, i) => (
            <>
              <Level
                key={i}
                avatar={avatar}
                colour={resolveUserColour(i)}
                index={i}
                level={level}
                tag={tag}
                userID={userID}
                xp={xp}
              />
              {i + 1 !== data.levels.length && <hr />}
            </>
          ))}
        </div>

        <div className={styles.xpRolesContainer}>
          <span>XP Roles</span>

          <div>
            <span>Level 123</span>
            <p>
              <div>yeeter</div>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
