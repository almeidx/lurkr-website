import React from 'react';

import styles from './LoadingGuildBox.module.css';

const LoadingGuildBox = () => <div className={`${styles['block']} ${styles['shimmer']}`} />;

export default LoadingGuildBox;
