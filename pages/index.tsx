import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import AnimatedNumber from 'react-animated-number';
import { Guild } from '../@types';
import axios from 'axios';

import SearchBar from '../components/SearchBar';
import LoadingGuildBox from '../components/LoadingGuildBox';
import GuildBox from '../components/GuildBox';

import styles from '../styles/Home.module.css';

export default function Home() {
  const [totalEmojis, setTotalEmojis] = useState(0);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<Guild[]>('/api/guilds').then((r) => {
      setLoading(false);
      setGuilds(r.data);
      setTotalEmojis(r.data.reduce((a, g) => a + g.emojiCount, 0));
    });
  }, []);

  return (
    <div className={styles['container']} >
      <div className={styles['wrapper']} >
        <nav className={styles['nav']} >
          <Image width={50} height={50} src='/nitro-hover.gif' alt='Pepe Nitro Hover' />
          <span>Pepe Emoji Server</span>

          <button
            className={styles['leaderboard-button']}
            onClick={() => window.open('https://arcanebot.xyz/leaderboard/pepeemoji')}
            type='button'
          >
            Leaderboard
          </button>
        </nav>
      </div>
      <div className={styles['wrapper']} >
        <span>
          <AnimatedNumber
            style={{
              transition: '0.8s ease-out',
              transitionProperty: 'background-color, color, opacity',
            }}
            frameStyle={(p) => (p === 100 ? {} : { opacity: 0.25 })}
            stepPrecision={0}
            value={totalEmojis}
            duration={1e3}
            formatValue={(n) => `${n.toLocaleString('en')} unique Pepe emojis`}
          />
        </span>
      </div>
      <SearchBar />
      <div className={styles['wrapper']} >
        <h2>The official Pepe Emoji Servers</h2>
      </div>
      <section className={styles['grid-section']} >
        {isLoading ? (
          <>
            <LoadingGuildBox />
            <LoadingGuildBox />
            <LoadingGuildBox />
            <LoadingGuildBox />
            <LoadingGuildBox />
            <LoadingGuildBox />
          </>
        ) : guilds.map((g: Guild) => (
          <GuildBox key={g.id} name={g.name} icon={g.icon} invite={g.invite} memberCount={g.memberCount} />
        ))}
      </section>
    </div>
  );
}
