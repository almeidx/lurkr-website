import { TailSpin } from '@agney/react-loading';

import styles from '../styles/components/Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      <TailSpin width="128px" height="128px" />
    </div>
  );
}
