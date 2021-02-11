import React from 'react';

import styles from '../styles/404.module.css';

export default function Error404() {
  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles['status-code']}>404</h1>
        <div className={styles['description-container']}>
          <h2 className={styles.description}>This page could not be found.</h2>
        </div>
      </div>
    </div>
  );
}
