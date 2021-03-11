import type { ChangeEvent } from 'react';
import {
  DISCORD_USER_AVATAR_CDN,
  DISCORD_USER_DEFAULT_AVATAR_CDN,
  FALLBACK_AVATAR,
  Snowflake,
} from '../utils/constants';
import styles from '../styles/components/Level.module.css';

export interface Level {
  avatar: string | null;
  level: number;
  tag: string | null;
  userID: Snowflake;
  xp: number;
}

export enum Colours {
  GOLD = '#faa61a',
  SILVER = '#cad5db',
  BRONZE = '#a54e00',
  REST = '#15181c',
}

interface LevelProps extends Level {
  colour: Colours;
  index: number;
}

export default function Level({ avatar, colour, index, level, tag, userID }: LevelProps) {
  function handleImageError(event: ChangeEvent<HTMLImageElement>) {
    event.target.onerror = null;
    event.target.src = FALLBACK_AVATAR;
  }

  const avatarURL = avatar
    ? DISCORD_USER_AVATAR_CDN(userID, avatar)
    : tag
    ? DISCORD_USER_DEFAULT_AVATAR_CDN(Number(tag.split(/#(\d{4})$/)[1]))
    : FALLBACK_AVATAR;

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <span style={{ backgroundColor: colour }}>{index + 1}</span>
        <img src={avatarURL} alt={`${tag ?? userID} avatar icon`} height={64} width={64} onError={handleImageError} />
        <p>{tag ?? userID}</p>
      </div>

      <div className={styles.levelInfo}>
        <span>Level {level}</span>
      </div>
    </div>
  );
}
