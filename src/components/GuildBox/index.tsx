import React, { FC } from 'react'

import './styles.css';

interface GuildBoxOptions {
  icon: string;
  name: string;
  invite: string;
}

const GuildBox: FC<GuildBoxOptions> = (opts) => {
  return (
    <div className='guildbox-container'>
      <div className='guildbox-div-container'>
        <img className='guild-icon' src={opts.icon} alt="Guild Icon" />
        <span>{opts.name}</span>
      </div>

      {/* <Emojis>

      </Emojis> */}

      <button
        className='guild-join-button'
        onClick={() => window.location.href = `https://discord.gg/${opts.invite}`}
      >
        Join Server
      </button>
    </div>
  );
}

export default GuildBox;
