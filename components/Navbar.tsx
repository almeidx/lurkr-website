import { useRouter } from 'next/router';
import React, { FC } from 'react';
import styles from './Navbar.module.css';

const Navbar: FC = () => {
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      <span className={styles.brand} onClick={() => router.push('/')}>
        PEPE MANAGER
      </span>
      <ul className={styles['list-container']}>
        <li className={styles['list-item']}>
          <a href="/">Home</a>
        </li>
        <li className={styles['list-item']}>
          <a href="/bot">Bot</a>
        </li>
        <li className={styles['list-item']}>
          <a href="/levels">Levels</a>
        </li>
        <li className={styles['list-item']}>
          <a href="/merch">Merch</a>
        </li>
        <li className={styles['list-item']}>
          <a href="https://discord.gg/pepe">Support Server</a>
        </li>
      </ul>
      <div className={styles['login-container']}>
        <button className={styles.login}>Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
