import React, { FC, useEffect, useState } from 'react';

import NitroHover from '../../assets/NitroHover.gif';
import api from '../../services/api';

import SearchBar from '../SearchBar';
import GuildBox from '../GuildBox';

import { Container, GridSection, NavBar, Wrapper } from './styles';

interface Guild {
  id: string;
  name: string;
  memberCount: number;
  icon: string;
  invite: string;
  emojis: Emoji[]
}

interface Emoji {
  animated: boolean;
  name: string;
  id: string;
  url: string;
}

const Layout: FC = () => {
  const [guilds, setGuilds] = useState<Guild[]>([])

  useEffect(() => {
    api.get<Guild[]>('guilds').then((r) => {
      setGuilds(r.data);
    });
  }, [])

  return (
    <Container>
      <br />
      <Wrapper>
        <NavBar>
          <img src={NitroHover} alt='Pepe' />
          <span>Pepe Emoji Server</span>
        </NavBar>
      </Wrapper>
      <br />
      <br />
      <Wrapper>
        <span>1,017 unique Pepe emojis</span>
      </Wrapper>
      <br />
      <SearchBar />
      <br />
      <Wrapper>
        <h2>The official Pepe Emoji Servers</h2>
      </Wrapper>
      <br />
      <Wrapper>
        <GridSection>
          {guilds.map((g: Guild) => {
            return (
              <GuildBox key={g.id} name={g.name} icon={g.icon} invite={g.invite} />
            );
          })}
        </GridSection>
      </Wrapper>
    </Container>
  );
}

export default Layout;
