import React, { FC } from 'react';

import NitroHover from '../../assets/NitroHover.gif';

import SearchBar from '../SearchBar'

import { Container, NavBar, Wrapper } from './styles';

const Layout: FC = () => {
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

      <Wrapper>
        <ul>
          <li>
            <div>
              Pepe Emoji Server
            </div>
          </li>
          <li>
            <div>
              Pepe Emoji Server 2
            </div>
          </li>
          <li>
            <div>
              Pepe Emoji Server 3
            </div>
          </li>
          <li>
            <div>
              Pepe Emoji Server 4
            </div>
          </li>
          <li>
            <div>
              Pepe Emoji Flags
            </div>
          </li>
        </ul>
      </Wrapper>
    </Container>
  );
}

export default Layout;
