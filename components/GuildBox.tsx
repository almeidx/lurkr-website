import React, { FC } from 'react';
import { FaSignInAlt } from 'react-icons/fa';

import styles from './GuildBox.module.css';

interface GuildBoxProps {
  icon: string;
  id: string;
  name: string;
  invite: string;
  memberCount: number;
}

const GuildBox: FC<GuildBoxProps> = ({ id, icon, invite, memberCount, name }) => (
  <div className={styles['container']} >
    <div className={styles['div-container']} >
      <img width={50} height={50} className={styles['guild-icon']} src={`https://cdn.discordapp.com/icons/${id}/${icon}.${icon.startsWith('a_') ? 'gif' : 'webp'}?size=128`} alt='Guild Icon' />
      <p>{name}</p>
    </div>
    <p className={styles['guild-memberCount']} >
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
      <FaSignInAlt className={styles['join-icon']} />
    </button>
  </div>
);

export default GuildBox;
