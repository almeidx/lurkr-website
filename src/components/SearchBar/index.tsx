import React, { FC } from 'react';

import { Container, Input } from './styles';

const SearchBar: FC = () => {
  return (
    <Container>
      <Input type="text" placeholder="Search for Pepe emojis and servers" />
    </Container>
  );
}

export default SearchBar;
