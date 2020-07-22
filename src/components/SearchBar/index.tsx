import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import api from '../../services/api';

import { Container, EmojiContainer, Input } from './styles';

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
  emojis: Emoji[]
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
      const found = emojis.filter((e) => e.name.toLowerCase().includes(value.toLowerCase()))

      setWantedEmojis(found);
    }
  };

  useEffect(() => {
    api.get<Emoji[]>('emojis').then((r) => {
      setEmojis(r.data);
    });
  }, []);

  useEffect(() => {
    api.get<Guild[]>('guilds').then((r) => {
      setGuilds(r.data);
    })
  }, []);

  return (
    <Container>
      <Input type="text" onChange={handleInputChange} placeholder="Search for Pepe emojis and servers" />
      <br />
      <EmojiContainer>
        {wantedEmojis.map((e) => (
          <a href={`https://discord.gg/${guilds.find((g) => g.emojis.some((em) => em.id === e.id))?.invite}`}>
            <img key={e.id} src={e.url} alt={e.name} />
          </a>
        ))}
      </EmojiContainer>
    </Container>
  );
}

export default SearchBar;
