import React from 'react';
import Image from 'next/image';
import { AiFillYoutube } from 'react-icons/ai';
import { MdLibraryAdd, MdLayers } from 'react-icons/md';
import { RiShieldStarFill } from 'react-icons/ri';
import { FaDiscord } from 'react-icons/fa';

import styles from '../../styles/Bot.module.css';

export default function Bot() {
  return (
    <div className={styles.container}>
      <nav>
        <div className={styles['icon-container']}>
          <Image src="/static/pepe-manager.png" width={80} height={80} alt="Pepe Manager icon" />
        </div>
        <h1>Pepe Manager Dashboard</h1>
        <div
          className={styles['icon-container']}
          style={{ background: 'unset', cursor: 'pointer' }}
          onClick={() => window.open('https://discord.gg/pepe')}
        >
          <FaDiscord style={{ fill: '#5c6bc0', height: '90px', width: '90px' }} />
        </div>
      </nav>

      <ul className={styles['item-list']}>
        <li className={styles['list-item']}>
          <RiShieldStarFill className={styles.icon} style={{ fill: '#ffcd4c' }} />
          <span>Manage Servers</span>
        </li>
        <li className={styles['list-item']} onClick={() => window.open('https://pepe-is.life/bot-invite')}>
          <MdLibraryAdd className={styles.icon} style={{ fill: '#79b453' }} />
          <span>Add to Server</span>
        </li>
        <li className={styles['list-item']} onClick={() => window.open('https://docs.pepe-is.life/docs')}>
          <MdLayers className={styles.icon} style={{ fill: '#4181ee' }} />
          <span>Documentation</span>
        </li>
        <li className={styles['list-item']}>
          <AiFillYoutube className={styles.icon} style={{ fill: '#ff3b3b' }} />
          <span>Tutorials</span>
        </li>
      </ul>
    </div>
  );
}
