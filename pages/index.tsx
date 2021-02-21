import React, { ChangeEvent, useCallback, useState } from 'react';
import AnimatedNumber from 'react-animated-number';
import Tooltip from 'react-tooltip-lite';
import Image from 'next/image';
import axios from 'axios';
import type { IEmoji, IGuild } from '../typings';
import GuildBox from '../components/GuildBox';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar';
import type { GetStaticProps } from 'next';

interface StaticProps {
  emojiCount: number;
  guilds: IGuild[];
}

const MAIN_DOMAIN = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://pepe-is.life';

export default function Home({ emojiCount, guilds }: StaticProps) {
  const [input, setInput] = useState('');
  const [wantedEmojis, setWantedEmojis] = useState<IEmoji[]>([]);
  const [timeout, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSearchLoading, setSearchLoading] = useState(false);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
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

          axios
            .get<IEmoji[]>('/api/search', {
              params: {
                q: inputLower,
              },
            })
            .then((r) => {
              setSearchLoading(false);
              setWantedEmojis(r.data);
            })
            .catch(() => void 0);
        }, 750),
      );
    },
    [timeout],
  );

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <span>
            <AnimatedNumber
              style={{
                transition: '250ms ease-out',
                transitionProperty: 'background-color, color, opacity',
              }}
              frameStyle={(p) => (p === 100 ? {} : { opacity: 0.25 })}
              stepPrecision={0}
              value={emojiCount}
              duration={250}
              formatValue={(n) => `${n.toLocaleString()} unique Pepe emojis`}
            />
          </span>
        </div>
        <div className={styles['searchbar-container']}>
          <input
            className={styles['searchbar-input']}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Search for Pepe emojis"
          />
          <div className={styles['searchbar-emoji-container']}>
            {isSearchLoading && <Image width={48} height={48} src="/static/loading.gif" alt="Loading GIF" />}
            {(wantedEmojis.length &&
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              wantedEmojis.map((e) => (
                <Tooltip key={e.id} content={`:${e.name}:`} color="#fff" background="#000">
                  <a target="_blank" rel="noopener noreferrer" href={`https://discord.gg/${e.invite}`}>
                    <img
                      width={48}
                      height={48}
                      src={`https://cdn.discordapp.com/emojis/${e.id}.${e.name.startsWith('a') ? 'gif' : 'png'}?v=1`}
                      alt={e.name}
                      onLoad={() => setSearchLoading(false)}
                    />
                  </a>
                </Tooltip>
              ))) ||
              (input && !isSearchLoading && !timeout && <p>Could not find anything</p>)}
          </div>
        </div>
        <div className={styles.wrapper}>
          <h2>The official Pepe Emoji Servers</h2>
        </div>
        <section className={styles['grid-section']}>
          {guilds.map((g) => (
            <GuildBox key={g.id} id={g.id} name={g.name} icon={g.icon} invite={g.invite} memberCount={g.memberCount} />
          ))}
        </section>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  try {
    const { data } = await axios.get<IGuild[]>('/api/guilds', {
      baseURL: MAIN_DOMAIN,
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
