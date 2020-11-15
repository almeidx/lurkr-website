import React, { FC } from 'react';
import { FaSignInAlt } from 'react-icons/fa';

import styles from './GuildBox.module.css';

interface GuildBoxProps {
  icon: string;
  name: string;
  invite: string;
  memberCount: number;
}

const GuildBox: FC<GuildBoxProps> = ({
  icon, invite, memberCount, name,
}) => (
  <div className={styles['guildbox-container']} >
    <div className={styles['guildbox-div-container']} >
      <img className={styles['guild-icon']} src={icon} alt='Guild Icon' />
      <p>{name}</p>
    </div>
    <p className={styles['guildbox-guild-memberCount']} >
      {memberCount.toLocaleString('en')}
      {' '}
      members
    </p>

    <button
      className={styles['guild-join-button']}
      onClick={() => window.open(`https://discord.gg/${invite}`)}
      type='button'
    >
      Join
      {' '}
      <FaSignInAlt className={styles['guildbox-join-icon']} />
    </button>
  </div>
);

export default GuildBox;
