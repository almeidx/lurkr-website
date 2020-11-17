import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Image from 'next/image'
import AnimatedNumber from 'react-animated-number';
import Tooltip from 'react-tooltip-lite';
import axios from 'axios';

import type { IEmoji, IGuild } from '../@types';
import LoadingGuildBox from '../components/LoadingGuildBox';
import GuildBox from '../components/GuildBox';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [totalEmojis, setTotalEmojis] = useState(0);
  const [guilds, setGuilds] = useState<IGuild[]>([]);
  const [areGuildsLoading, setGuildsLoading] = useState(true);
  const [input, setInput] = useState('');
  const [wantedEmojis, setWantedEmojis] = useState<IEmoji[]>([]);
  const [timeout, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSearchLoading, setSearchLoading] = useState(false);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setInput(value);
    const inputLower = value.toLowerCase();

    if (timeout) {
      clearTimeout(timeout);
      setTimer(null);
    }
    if (!inputLower) return setWantedEmojis([]);

    setTimer(
      setTimeout(() => {
        setTimer(null);
        setWantedEmojis([]);
        setSearchLoading(true);

        axios.get<IEmoji[]>('/api/search', {
          params: {
            q: inputLower,
          },
        }).then((r) => {
          setSearchLoading(false);
          setWantedEmojis(r.data);
        });
      }, 750),
    );
  }, [timeout]);

  const handleImageLoad = useCallback(() => setSearchLoading(false), []);

  useEffect(() => {
    axios.get<IGuild[]>('/api/guilds').then((r) => {
      setGuildsLoading(false);
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
      <div className={styles['searchbar-container']} >
        <input
          className={styles['searchbar-input']}
          type='text'
          value={input}
          onChange={handleInputChange}
          placeholder='Search for Pepe emojis'
        />
        <div className={styles['searchbar-emoji-container']} >
          {isSearchLoading && <Image width={45} height={50} src='/loading.gif' alt='Loading GIF' />}
          {(wantedEmojis.length && wantedEmojis.map((e) => (
            <Tooltip key={e.id} content={`:${e.name}:`} color='#fff' background='#000'>
              <a
                target='_blank'
                rel='noopener noreferrer'
                href={`https://discord.gg/${e.invite}`}
              >
                <img width={64} height={58} src={e.url} alt={e.name} onLoad={handleImageLoad} />
              </a>
            </Tooltip>
          ))) || (input && !isSearchLoading && !timeout && <p>Could not find anything</p>)}
        </div>
      </div>
      <div className={styles['wrapper']} >
        <h2>The official Pepe Emoji Servers</h2>
      </div>
      <section className={styles['grid-section']} >
        {areGuildsLoading ? (
          <>
            <LoadingGuildBox />
            <LoadingGuildBox />
            <LoadingGuildBox />
            <LoadingGuildBox />
            <LoadingGuildBox />
            <LoadingGuildBox />
          </>
        ) : guilds.map((g) => (
          <GuildBox key={g.id} name={g.name} icon={g.icon} invite={g.invite} memberCount={g.memberCount} />
        ))}
      </section>
    </div>
  );
}
