import { useCallback } from 'react';
import { AiFillYoutube } from 'react-icons/ai';
import { MdLibraryAdd, MdLayers } from 'react-icons/md';
import styles from '../styles/Bot.module.css';

import { RiShieldStarFill } from 'react-icons/ri';

export default function Bot() {
  const handleButtonClick = useCallback((url: string) => {
    window.open(url);
  }, []);

  return (
    <div className={styles['container']} >
      <h1>Pepe Manager Dashboard</h1>

      <ul className={styles['item-list']} >
        <li className={styles['list-item']} >
          <RiShieldStarFill className={styles['icon']} style={{ fill: '#ffcd4c' }} />
          <span>Manage Servers</span>
        </li>
        <li className={styles['list-item']} onClick={() => handleButtonClick('https://discord.com/api/oauth2/authorize?client_id=506186003816513538&permissions=1611000960&scope=bot')} >
          <MdLibraryAdd className={styles['icon']} style={{ fill: '#79b453' }} />
          <span>Add to Server</span>
        </li>
        <li className={styles['list-item']} >
          <MdLayers className={styles['icon']} style={{ fill: '#4181ee' }} />
          <span>Commands</span>
        </li>
        <li className={styles['list-item']} >
          <AiFillYoutube className={styles['icon']} style={{ fill: '#ff3b3b' }} />
          <span>Tutorials</span>
        </li>
      </ul>
    </div>
  );
}
