import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import Loader from 'react-loader-spinner';

import styles from '../styles/components/Loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.container}>
      <Loader type="TailSpin" color="var(--white)" height={128} width={128} />
    </div>
  );
}
