import React from 'react';
import { AiFillYoutube } from 'react-icons/ai';
import { MdLibraryAdd, MdLayers } from 'react-icons/md';
import { RiShieldStarFill } from 'react-icons/ri';
import styles from '../../styles/Bot.module.css';
import Navbar from '../../components/Navbar';

export default function Bot() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1>Pepe Manager Dashboard</h1>

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
    </>
  );
}
