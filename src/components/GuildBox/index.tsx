import React, { FC } from 'react';
import { FaSignInAlt } from 'react-icons/fa';

import './styles.css';

interface GuildBoxProps {
  icon: string;
  name: string;
  invite: string;
}

const GuildBox: FC<GuildBoxProps> = ({ icon, invite, name }) => (
  <div className='guildbox-container'>
    <div className='guildbox-div-container'>
      <img className='guild-icon' src={icon} alt='Guild Icon' />
      <p>{name}</p>
    </div>

    <button
      className='guild-join-button'
      onClick={() => window.open(`https://discord.gg/${invite}`)}
      type='button'
    >
      Join
      {' '}
      <FaSignInAlt className='guildbox-join-icon' />
    </button>
  </div>
);

export default GuildBox;
