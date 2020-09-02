import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import Tooltip from 'react-tooltip-lite';
import api from '../../services/api';

import loadingGif from '../../assets/loading.gif';
import './styles.css';

interface Emoji {
  animated: boolean;
  id: string;
  name: string;
  url: string;
}

interface Guild {
  id: string;
  name: string;
  memberCount: number;
  icon: string;
  invite: string;
  emojis: Emoji[];
}

const SearchBar: FC = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [input, setInput] = useState<string>('');
  const [wantedEmojis, setWantedEmojis] = useState<Emoji[]>([]);
  const [timeout, setTimer] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!guilds.length) return setInput('');

    const { value } = event.target;
    setInput(value);
    const inputLower = value.toLowerCase();

    if (timeout) {
      clearTimeout(timeout);
      setTimer(0);
    }
    if (!inputLower) return setWantedEmojis([]);

    setTimer(
      setTimeout(() => {
        setTimer(0);
        setWantedEmojis([]);
        setLoading(true);

        console.log('calling api for: ', inputLower);

        api.get('search', { params: { q: inputLower } }).then((res) => {
          setLoading(false);
          setWantedEmojis(res.data);
        });
      }, 750)
    );
  };

  useEffect(() => {
    api.get<Guild[]>('guilds').then((r) => setGuilds(r.data));
  }, []);

  const handleImageLoad = () => setLoading(false);

  return (
    <div className='searchbar-container'>
      <input
        className='searchbar-input'
        type='text'
        value={input}
        onChange={handleInputChange}
        placeholder='Search for Pepe emojis'
      />
      <br />
      <div className='searchbar-emoji-container'>
        {isLoading && <img src={loadingGif} alt="Loading" />} 
        {(wantedEmojis.length && wantedEmojis.map((e) => (
          <Tooltip key={e.id} content={`:${e.name}:`} color='#fff' background='#000' >
            <a href={`https://discord.gg/${guilds.find((g) => g.emojis.some(({ id }) => id === e.id))?.invite}`}>
              <img src={e.url} alt={e.name} onLoad={handleImageLoad} />
            </a>
          </Tooltip>
        ))) || (input && !isLoading && !timeout && (
          <p>Could not find anything</p>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
