import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import styles from '../../styles/Levels.module.css';
import type { LevelsType } from '../../@types';
import LevelCard, { Colors } from '../../components/LevelCard';
import { BallTriangle } from '@agney/react-loading';

export default function Levels() {
  const router = useRouter();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [data, setData] = useState<LevelsType | null>(null);

  /* router.query is only loaded on the second hydration for some reason */

  useEffect(() => {
    if (Object.keys(router.query).length) setLoaded(true);
  }, [router.query]);

  useEffect(() => {
    if (router.query.id) {
      axios
        .get<LevelsType>(`/api/levels/${router.query.id as string}`)
        .then((res) => {
          setData(res.data);
        })
        .catch(() => null);
    }
  }, [router.query.id]);

  if (!loaded || !data) {
    return (
      <div className={styles['loading-container']}>
        <BallTriangle width="128px" height="128px" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{data.guild.name} Leaderboard | Pepe Manager</title>
      </Head>

      <nav className={styles.navbar}>
        <div className={styles['icon-container']}>
          <img width={100} height={100} src={data.guild.icon ?? '/static/pepe-manager.png'} alt="Pepe Nitro Hover" />
        </div>
        <h1 className={styles.title}>{data.guild.name}</h1>
      </nav>

      <main className={styles.container}>
        {data.levels.map((l, i) => (
          <LevelCard
            key={i}
            avatar={l.avatar}
            id={l.id}
            index={i}
            level={l.level}
            tag={l.tag}
            xp={l.xp}
            colour={i === 0 ? Colors.GOLD : i === 1 ? Colors.SILVER : i === 2 ? Colors.BRONZE : Colors.REST}
          />
        ))}
      </main>
    </>
  );
}
