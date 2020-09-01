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
  const [wantedEmojis, setWantedEmojis] = useState<Emoji[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const input = value.toLowerCase();
    if (!input) {
      setWantedEmojis([]);
    } else {
      const found = emojis.filter((e) => e.name.toLowerCase().includes(value.toLowerCase()));
      setWantedEmojis(found);
    }
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
        onChange={handleInputChange} placeholder='Search for Pepe emojis and servers'
      />
      <br />
      <div className='searchbar-emoji-container'>
        {wantedEmojis.map((e) => (
          <Tooltip content={`:${e.name}:`} color='#fff' background='#000' >
            <a href={`https://discord.gg/${guilds.find((g) => g.emojis.some(({ id }) => id === e.id))?.invite}`}>
              <img key={e.id} src={e.url} alt={e.name} />
            </a>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
