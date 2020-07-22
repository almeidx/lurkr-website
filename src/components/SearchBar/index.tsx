import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import api from '../../services/api';

import { Container, EmojiContainer, Input } from './styles';

interface Emoji {
  animated: boolean;
  id: string;
  name: string;
  url: string;
}

const SearchBar: FC = () => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [wantedEmojis, setWantedEmojis] = useState<Emoji[]>([]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const found = emojis.filter((e) => e.name.toLowerCase().includes(value.toLowerCase()))

    setWantedEmojis(found);
  };

  useEffect(() => {
    api.get<Emoji[]>('emojis').then((r) => {
      setEmojis(r.data);
    });
  }, []);

  return (
    <Container>
      <Input type="text" onChange={handleInputChange} placeholder="Search for Pepe emojis and servers" />
      <br />
      <EmojiContainer>
        {wantedEmojis.map((e) => {
          return (
            <img key={e.id} src={e.url} alt={e.name} />
          );
        })}
      </EmojiContainer>
    </Container>
  );
}

export default SearchBar;
