import React, { ChangeEvent, useCallback, useState } from 'react';
import Image from 'next/image';
import Tooltip from 'react-tooltip-lite';
import { Emoji } from '../@types';

import styles from './SearchBar.module.css';

const SearchBar = () => {
  const [input, setInput] = useState('');
  const [wantedEmojis, setWantedEmojis] = useState<Emoji[]>([]);
  const [timeout, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setLoading] = useState(false);

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
        setLoading(true);

      fetch(`https://api.pepe-is.life/search?q=${encodeURIComponent(inputLower)}`)
        .then((r) => r.json())
        .then((r: Emoji[]) => {
          setLoading(false);
          setWantedEmojis(r);
        });
      }, 750),
    );
  }, [timeout]);

  const handleImageLoad = useCallback(() => setLoading(false), []);

  return (
    <div className={styles['searchbar-container']} >
      <input
        className={styles['searchbar-input']}
        type='text'
        value={input}
        onChange={handleInputChange}
        placeholder='Search for Pepe emojis'
      />
      <div className={styles['searchbar-emoji-container']} >
        {isLoading && <Image width={45} height={50} src='/loading.gif' alt='Loading GIF' />}
        {(wantedEmojis.length && wantedEmojis.map((e) => (
          <Tooltip key={e.id} content={`:${e.name}:`} color='#fff' background='#000'>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={`https://discord.gg/${e.invite}`}
            >
              <Image width={64} height={58} src={e.url} alt={e.name} onLoad={handleImageLoad} />
            </a>
          </Tooltip>
        ))) || (input && !isLoading && !timeout && <p>Could not find anything</p>)}
      </div>
    </div>
  );
};

export default SearchBar;
