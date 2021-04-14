import styles from '../styles/components/Error.module.css';

interface ErrorProps {
  message?: string;
  statusCode?: number;
}

export default function Error({ message = 'This page does not exist.', statusCode = 404 }: ErrorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h1>{statusCode}</h1>
        <div>
          <h2>{message}</h2>
        </div>
      </div>
    </div>
  );
}
