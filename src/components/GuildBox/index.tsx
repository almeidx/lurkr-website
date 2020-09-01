import React, { FC } from 'react'
import { FaSignInAlt } from 'react-icons/fa';

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
        <img className='guild-icon' src={opts.icon} alt='Guild Icon' />
        <p>{opts.name}</p>
      </div>

      <button
        className='guild-join-button'
        onClick={() => window.location.href = `https://discord.gg/${opts.invite}`}
      >
        Join <FaSignInAlt className='guildbox-join-icon' />
      </button>
    </div>
  );
}

export default GuildBox;
