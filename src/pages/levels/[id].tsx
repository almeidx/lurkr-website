import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import Level, { Colours, Level as LevelInfo } from '../../components/Level';
import styles from '../../styles/pages/Leaderboard.module.css';
import Error from '../../components/Error';

interface Levels {
  guild: {
    icon: string;
    name: string;
  };
  levels: LevelInfo[];
}

export default function Leaderboard() {
  const router = useRouter();

  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasErrored, setHasErrored] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [levelsData, setLevelsData] = useState<Levels | null>(null);

  /* Router query isn't available on server */
  useEffect(() => {
    if (Object.keys(router.query).length) {
      setHasLoaded(true);
      if (typeof router.query.id === 'string') setId(router.query.id);
    }
  }, [router.query]);

  if (!hasLoaded) return <h1>Loading...</h1>;

  if (!id || hasErrored) {
    return (
      <Error
        message="Failed to retreive level information. Perhaps that server does not exist or doesn't have the leveling system enabled."
        statusCode={400}
      />
    );
  }

  axios
    .get<Levels>(`/levels/${id}`, { baseURL: API_BASE_URL })
    .then(({ data }) => setLevelsData(data))
    .catch(() => setHasErrored(true));

  if (!levelsData) return <h1>loading data</h1>;

  function resolveUserColour(index: number) {
    return index === 0 ? Colours.GOLD : index === 1 ? Colours.SILVER : index === 2 ? Colours.BRONZE : Colours.REST;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{levelsData.guild.name} Leaderboard | Pepe Manager</title>
      </Head>

      <header>
        <img src={levelsData.guild.icon} alt={`${levelsData.guild.name} server icon`} />
        <span>{levelsData.guild.name}</span>
      </header>

      <main>
        <div className={styles.leaderboardContainer}>
          {levelsData.levels.map(({ avatar, level, tag, userID, xp }, i) => (
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
              {i + 1 !== levelsData.levels.length && <hr />}
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
