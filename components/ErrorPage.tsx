import React, { FC } from 'react';
import styles from './ErrorPage.module.css';
import Navbar from '../components/Navbar';

interface ErrorProps {
  message: string;
  statusCode: number;
}

const ErrorPage: FC<ErrorProps> = ({ message, statusCode }) => {
  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <div>
          <h1 className={styles['status-code']}>{statusCode}</h1>
          <div className={styles['description-container']}>
            <h2 className={styles.description}>{message}</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
