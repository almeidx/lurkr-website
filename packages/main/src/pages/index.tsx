import { TailSpin } from '@agney/react-loading';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';

import { initializeApollo } from '../apollo/client';
import Emoji from '../components/Emoji';
import GuildBox from '../components/GuildBox';
import { SearchBarContext } from '../contexts/SearchBarContext';
import ALL_GUILDS, { AllGuilds } from '../graphql/AllGuilds';
import FIND_EMOJIS, { FindEmojis } from '../graphql/FindEmojis';
import styles from '../styles/pages/Home.module.css';

interface HomeProps {
  emojiCount: number;
  guilds: AllGuilds['allOfficialGuilds'];
  otherGuilds: AllGuilds['allOtherGuilds'];
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query<AllGuilds>({
    query: ALL_GUILDS,
  });

  const officialGuildsClone = [...data.allOfficialGuilds];
  const otherGuildsClone = [...data.allOtherGuilds];

  return {
    props: {
      emojiCount: officialGuildsClone.reduce((a, g) => a + g.emojiCount, 0),
      guilds: officialGuildsClone.sort((a, b) => b.memberCount - a.memberCount),
      otherGuilds: otherGuildsClone.sort((a, b) => b.memberCount - a.memberCount),
    },
    revalidate: 300,
  };
};

export default function Home({ emojiCount, guilds, otherGuilds }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isSearchLoading, searchTerm, updateSearchLoading, updateSearchTerm } = useContext(SearchBarContext);

  const [requestedEmojis, setRequestedEmojis] = useState<FindEmojis['findEmojis']>([]);
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

        const apolloClient = initializeApollo();
        apolloClient
          .query<FindEmojis>({
            query: FIND_EMOJIS,
            variables: { query: searchTerm },
          })
          .then(({ data }) => {
            if (!data.findEmojis.length) return updateSearchLoading(false);
            setRequestedEmojis(data.findEmojis);
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
    if (query) updateSearchTerm(decodeURIComponent(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Pepe Emoji</title>
      </Head>

      <section className={styles.mainContent}>
        <span>{emojiCount.toLocaleString()} unique Pepe Emojis</span>

        <input
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="on"
          autoFocus
          maxLength={32}
          onChange={(e) => updateSearchTerm(e.target.value)}
          placeholder="Search for Pepe Emojis"
          type="text"
          value={searchTerm}
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
