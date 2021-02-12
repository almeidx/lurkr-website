import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from '../../styles/LevelsIndex.module.css';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { isValidSnowflake } from '../../util/util';
import Navbar from '../../components/Navbar';

export default function LevelsIndex() {
  const [server, setServer] = useState('');
  const [arrowColour, setArrowColour] = useState('var(--white)');
  const router = useRouter();

  const handleSubmit = () => {
    if (!server || !isValidSnowflake(server)) return;
    void router.push(`/levels/${server}`);
  };

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setServer(target.value);

    if (isValidSnowflake(target.value)) setArrowColour('green');
    else setArrowColour('red');
  };

  useEffect(() => {
    const enterLogic = ({ code }: KeyboardEvent) => {
      if (code === 'Enter' || code === 'NumpadEnter') handleSubmit();
    };

    document.addEventListener('keydown', enterLogic);

    return () => document.removeEventListener('keydown', enterLogic);
  });

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <label className={styles['server-label']} htmlFor="input">
          Leaderboard
        </label>
        <div className={styles.grid}>
          <input
            className={styles['server-input']}
            type="number"
            id="input"
            value={server}
            onChange={handleInputChange}
            placeholder="Input a server ID to view it's leaderboard"
          />
          <div className={styles['submit-container']} onClick={handleSubmit}>
            <BsArrowReturnLeft fill={arrowColour} size={100} />
          </div>
        </div>
      </div>
    </>
  );
}
