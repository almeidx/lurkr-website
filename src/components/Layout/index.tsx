import React, { FC } from 'react';

import SearchBar from '../SearchBar'

import { Container, NavBar, Wrapper } from './styles';

const Layout: FC = () => {
  return (
    <Container>
      <NavBar>test</NavBar>
      <Wrapper>
        <span>1,002 unique Pepe emojis</span>
      </Wrapper>

      <SearchBar />
    </Container>
  );
}

export default Layout;
