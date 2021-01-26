import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Head from 'next/head';
import axios from 'axios';

import type { LevelsType } from '../../@types';
import LevelCard from '../../components/LevelCard';

export default function Leaderboard() {
  const router = useRouter();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [data, setData] = useState<LevelsType>(null);

  useEffect(() => {
    if (Object.keys(router.query).length) setLoaded(true);
  }, [router.query]);

  useEffect(() => {
    if (router.query.id) {
      axios.get<LevelsType>(`/api/levels/${router.query.id}`).then((res) => {
        setData(res.data);
      });
    }
  }, [router.query.id]);

  if (!loaded || !data) return <h1>Loading...</h1>

  return (
    <>
      <Head>
        <title>{data.guild.name} Leaderboard | Pepe Manager</title>
      </Head>

      <h1>Guild ID: {router.query.id}</h1>
      {data.levels.map((l, i) => (
        <LevelCard
          key={i}
          avatar={l.avatar}
          id={l.id}
          index={i}
          level={l.level}
          tag={l.tag}
          xp={l.xp}
        />
      ))}
    </>
  );
}
