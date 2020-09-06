import React, { FC } from 'react';
import { FaSignInAlt } from 'react-icons/fa';

import './styles.css';

interface GuildBoxProps {
  icon: string;
  name: string;
  invite: string;
  memberCount: number;
}

const GuildBox: FC<GuildBoxProps> = ({
  icon, invite, memberCount, name,
}) => (
  <div className='guildbox-container'>
    <div className='guildbox-div-container'>
      <img className='guild-icon' src={icon} alt='Guild Icon' />
      <p>{name}</p>
    </div>
    <p className='guildbox-guild-memberCount'>
      {memberCount.toLocaleString('en')}
      {' '}
      members
    </p>

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
