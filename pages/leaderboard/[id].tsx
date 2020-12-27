import axios from 'axios';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { ILevel } from '../../@types';

export default function Leaderboard() {
  const router = useRouter();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [levels, setLevels] = useState<ILevel[]>([]);

  useEffect(() => {
    if (Object.keys(router.query).length) setLoaded(true);
  }, [router.query]);

  useEffect(() => {
    axios.get<ILevel[]>(`/api/levels/${router.query.id}`).then((res) => {
      setLevels(res.data);
    });
  }, []);

  if (!loaded) return <h1>Loading...</h1>

  return (
    <>
      <h1>Guild ID: {router.query.id}</h1>
      {levels.map((l, i) => <p>{i + 1} - {l.id} - {l.level}</p>)}
    </>
  );
}
