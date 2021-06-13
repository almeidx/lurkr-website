import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { BsArrowReturnLeft } from 'react-icons/bs';

import styles from '../../styles/pages/levels/Levels.module.scss';
import { isValidSnowflake } from '../../utils/utils';

export default function Levels() {
  const [server, setServer] = useState('');
  const [arrowColour, setArrowColour] = useState('var(--white)');
  const router = useRouter();

  const handleSubmit = () => {
    if (!server || !isValidSnowflake(server)) return;
    void router.push(`/levels/${server}`);
  };

  function handleInputChange({ target }: ChangeEvent<HTMLInputElement>) {
    setServer(target.value);

    if (isValidSnowflake(target.value)) setArrowColour('green');
    else setArrowColour('red');
  }

  useEffect(() => {
    const enterLogic = ({ code }: KeyboardEvent) => {
      if (code === 'Enter' || code === 'NumpadEnter') handleSubmit();
    };

    document.addEventListener('keydown', enterLogic);

    return () => document.removeEventListener('keydown', enterLogic);
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Leveling - Pepe Manager</title>
      </Head>

      <label htmlFor="input">Leaderboard</label>
      <div className={styles.inputContainer}>
        <input
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          id="input"
          maxLength={19}
          onChange={handleInputChange}
          placeholder="Input a server ID to view it's leaderboard"
          type="number"
          value={server}
        />
        <div onClick={handleSubmit}>
          <BsArrowReturnLeft fill={arrowColour} size={100} />
        </div>
      </div>
    </div>
  );
}
