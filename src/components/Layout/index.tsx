import React, { FC, useEffect, useState } from 'react';

import NitroHover from '../../assets/NitroHover.gif';
import api from '../../services/api';

import LoadingGuildBox from '../Shimmer/LoadingGuildBox';
import SearchBar from '../SearchBar';
import GuildBox from '../GuildBox';

import './styles.css';

interface Guild {
  id: string;
  name: string;
  memberCount: number;
  icon: string;
  invite: string;
  emojis: Emoji[];
}

interface Emoji {
  animated: boolean;
  name: string;
  id: string;
  url: string;
}

const Layout: FC = () => {
  const [totalEmojis, setTotalEmojis] = useState<string>('Many');
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Guild[]>('guilds').then((r) => {
      setLoading(false);
      setGuilds(r.data);
      setTotalEmojis(r.data.reduce((g, a) => g + a.emojis.length, 0).toLocaleString());
    });
  }, []);

  return (
    <div className='container'>
      <br />
      <div className='wrapper'>
        <nav className='nav'>
          <img src={NitroHover} alt='Pepe' />
          <span>Pepe Emoji Server</span>
        </nav>
      </div>
      <br />
      <br />
      <div className='wrapper'>
        <span>{totalEmojis} unique Pepe emojis</span>
      </div >
      <br />
      <SearchBar />
      <br />
      <div className='wrapper'>
        <h2>The official Pepe Emoji Servers</h2>
      </div>
      <br />
      <div className='wrapper'>
        <section className='grid-section'>
          {isLoading ? (
            <>
              <LoadingGuildBox />
              <LoadingGuildBox />
              <LoadingGuildBox />
              <LoadingGuildBox />
              <LoadingGuildBox />
            </>
          ) :
            guilds.map((g: Guild) => (
              <GuildBox key={g.id} name={g.name} icon={g.icon} invite={g.invite} />
            ))
          }
        </section>
      </div>
    </div>
  );
}

export default Layout;
