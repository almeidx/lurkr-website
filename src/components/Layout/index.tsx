import React, { FC, useEffect, useState } from 'react';
import AnimatedNumber from 'react-animated-number';
import { Guild } from '../../@types';
import api from '../../services/api';

import SearchBar from '../SearchBar';
import LoadingGuildBox from '../Shimmer/LoadingGuildBox';
import GuildBox from '../GuildBox';
import nitroHoverGif from '../../assets/nitro-hover.gif';

import './styles.css';

const Layout: FC = () => {
  const [totalEmojis, setTotalEmojis] = useState(0);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Guild[]>('guilds').then((r) => {
      setLoading(false);
      setGuilds(r.data);
      setTotalEmojis(r.data.reduce((g, a) => g + a.emojis.length, 0));
    });
  }, []);

  return (
    <div className='container'>
      <div className='wrapper'>
        <nav className='nav'>
          <img src={nitroHoverGif} alt='Pepe Nitro Hover' />
          <span>Pepe Emoji Server</span>
        </nav>
      </div>
      <div className='wrapper'>
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
      <div className='wrapper'>
        <h2>The official Pepe Emoji Servers</h2>
      </div>
      <section className='grid-section'>
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
};

export default Layout;
