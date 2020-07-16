import React, { FC } from 'react'

import { Container, GuildIcon, JoinButton, NavContainer } from './styles';

interface GuildBoxOptions {
  icon: string;
  name: string;
  invite: string;
}

const GuildBox: FC<GuildBoxOptions> = (opts) => {
  return (
    <Container>
      <NavContainer>
        <GuildIcon src={opts.icon} alt="Guild Icon" />
          <span>{opts.name}</span>
      </NavContainer>

      {/* <Emojis>

      </Emojis> */}

      <JoinButton onClick={() => window.location.href = `https://discord.gg/${opts.invite}`}>Join Server</JoinButton>
    </Container>
  );
}

export default GuildBox;
