import { TailSpin } from '@agney/react-loading';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';

import Emoji from '../components/Emoji';
import GuildBox from '../components/GuildBox';
import { SearchBarContext } from '../contexts/SearchBarContext';
import api from '../services/api';
import styles from '../styles/pages/Home.module.css';
import type { Snowflake } from '../utils/constants';

interface Guild {
  emojiCount: number;
  icon: string;
  id: Snowflake;
  invite: string;
  memberCount: number;
  name: string;
}

interface EmojiInfo {
  id: Snowflake;
  invite: string;
  name: string;
}

interface HomeProps {
  emojiCount: number;
  guilds: Guild[];
  otherGuilds: Guild[];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const { data } = await api.get<{ guilds: Guild[]; otherGuilds: Guild[] }>('/guilds');

    return {
      props: {
        emojiCount: data.guilds.reduce((a, g) => a + g.emojiCount, 0),
        guilds: data.guilds.sort((a, b) => b.memberCount - a.memberCount),
        otherGuilds: data.otherGuilds.sort((a, b) => b.memberCount - a.memberCount),
      },
      revalidate: 300,
    };
  } catch {
    return { notFound: true };
  }
};

export default function Home({ emojiCount, guilds, otherGuilds }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isSearchLoading, searchTerm, updateSearchLoading, updateSearchTerm } = useContext(SearchBarContext);

  const [requestedEmojis, setRequestedEmojis] = useState<EmojiInfo[]>([]);
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

        api
          .post('/search', { params: { q: searchTerm } })
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
          maxLength={32}
          onChange={(e) => updateSearchTerm(e.target.value)}
          placeholder="Search for Pepe Emojis"
        />

        <div className={styles.requestedEmojisContainer}>
          {isSearchLoading && <TailSpin width="48px" height="48px" />}

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

        <span>Other Emoji servers</span>

        <div className={styles.guildsContainer}>
          {otherGuilds.map((g) => (
            <GuildBox key={g.id} id={g.id} name={g.name} icon={g.icon} invite={g.invite} memberCount={g.memberCount} />
          ))}
        </div>
      </section>
    </div>
  );
}
