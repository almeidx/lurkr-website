import styles from '../styles/components/Error.module.css';

interface ErrorProps {
  message: string;
  statusCode: number;
}

export default function Error({ message, statusCode }: ErrorProps) {
  return (
    <div className={styles.container}>
      <div>
        <h1>{statusCode}</h1>
        <div>
          <h2>{message}</h2>
        </div>
      </div>
    </div>
  );
}
