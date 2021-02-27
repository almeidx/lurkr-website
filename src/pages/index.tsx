import type { GetStaticProps } from 'next';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Emoji from '../components/Emoji';
import styles from '../styles/pages/Home.module.css';
import { SearchBarContext } from '../contexts/SearchBarContext';
import { BallTriangle } from '@agney/react-loading';
import { API_BASE_URL, Snowflake } from '../utils/constants';
import GuildBox from '../components/GuildBox';

interface Guild {
  emojiCount: number;
  icon: string;
  id: Snowflake;
  invite: string;
  memberCount: number;
  name: string;
}

interface Emoji {
  id: Snowflake;
  invite: string;
  name: string;
}

interface HomeProps {
  emojiCount: number;
  guilds: Guild[];
}

export default function Home({ emojiCount, guilds }: HomeProps) {
  const { isSearchLoading, searchTerm, updateSearchLoading, updateSearchTerm } = useContext(SearchBarContext);

  const [requestedEmojis, setRequestedEmojis] = useState<Emoji[]>([]);
  const [isTimeoutRunning, setIsTimeoutRunning] = useState(false);

  useEffect(() => {
    if (!searchTerm) {
      updateSearchLoading(false);
      updateSearchTerm('');
      setRequestedEmojis([]);
      return () => void 0;
    }

    setIsTimeoutRunning(true);
    const typingTimeout = setTimeout(() => {
      setIsTimeoutRunning(false);
      if (searchTerm) {
        setRequestedEmojis([]);
        updateSearchLoading(true);

        axios('/search', { baseURL: API_BASE_URL, params: { q: searchTerm } })
          .then(({ data }) => {
            if (!data.length) return updateSearchLoading(false);
            setRequestedEmojis(data);
          })
          .catch(() => {
            updateSearchLoading(false);
            setRequestedEmojis([]);
          });
      }
    }, 750);

    return () => {
      setIsTimeoutRunning(false);
      clearTimeout(typingTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) updateSearchTerm(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Pepe Emoji</title>
      </Head>

      <section>
        <span>{emojiCount.toLocaleString()} unique Pepe Emojis</span>

        <input
          autoFocus
          type="text"
          autoComplete="off"
          value={searchTerm}
          onChange={(e) => updateSearchTerm(e.target.value)}
          placeholder="Search for Pepe Emojis"
        />

        <div className={styles.requestedEmojisContainer}>
          {isSearchLoading && <BallTriangle width="48px" height="48px" />}

          {requestedEmojis.length !== 0
            ? requestedEmojis.map(({ id, invite, name }) => <Emoji key={id} invite={invite} id={id} name={name} />)
            : searchTerm && !isSearchLoading && !isTimeoutRunning && <p>Could not find anything</p>}
        </div>

        <span>The official Pepe Emoji servers</span>

        <div className={styles.guildsContainer}>
          {guilds.map((g) => (
            <GuildBox key={g.id} id={g.id} name={g.name} icon={g.icon} invite={g.invite} memberCount={g.memberCount} />
          ))}
        </div>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const { data } = await axios.get<Guild[]>('/guilds', {
      baseURL: API_BASE_URL,
    });

    return {
      props: {
        emojiCount: data.reduce((a, g) => a + g.emojiCount, 0),
        guilds: data.sort((a, b) => b.memberCount - a.memberCount),
      },
      revalidate: 60,
    };
  } catch {
    return { notFound: true };
  }
};
