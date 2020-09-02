import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import Tooltip from 'react-tooltip-lite';
import api from '../../services/api';

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
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [input, setInput] = useState<string>('');
  const [wantedEmojis, setWantedEmojis] = useState<Emoji[]>([]);
  const [timeout, setTimer] = useState<number>(0);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!guilds.length) return setInput('');

    const { value } = event.target;
    setInput(value);
    const inputLower = value.toLowerCase();

    if (timeout) clearTimeout(timeout);
    if (!inputLower) return setWantedEmojis([]);

    setTimer(
      setTimeout(() => {
        const found = emojis.filter((e) => e.name.toLowerCase().includes(inputLower));
        setWantedEmojis(found);
      }, 750)
    );
  };

  useEffect(() => {
    api.get<Emoji[]>('emojis').then((r) => setEmojis(r.data));
  }, []);

  useEffect(() => {
    api.get<Guild[]>('guilds').then((r) => setGuilds(r.data));
  }, []);

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
        {wantedEmojis.map((e) => (
          <Tooltip key={e.id} content={`:${e.name}:`} color='#fff' background='#000' >
            <a href={`https://discord.gg/${guilds.find((g) => g.emojis.some(({ id }) => id === e.id))?.invite}`}>
              <img src={e.url} alt={e.name} />
            </a>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
