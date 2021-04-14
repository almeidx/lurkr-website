import type { Snowflake } from 'discord-api-types';
import type { ChangeEvent } from 'react';

import styles from '../styles/components/Level.module.css';
import { DISCORD_USER_AVATAR_CDN, DISCORD_USER_DEFAULT_AVATAR_CDN, FALLBACK_AVATAR } from '../utils/constants';

export interface LevelInfo {
  avatar: string | null;
  level: number;
  tag: string | null;
  userID: Snowflake;
  xp: number;
}

export interface Role {
  color: number;
  id: string;
  name: string;
}

export interface LevelRoles {
  level: number;
  roles: Role[];
}

export enum Colours {
  GOLD = '#faa61a',
  SILVER = '#cad5db',
  BRONZE = '#a54e00',
  REST = '#15181c',
}

interface LevelProps extends LevelInfo {
  colour: Colours;
  index: number;
  totalLevels: number;
}

export default function Level({ avatar, colour, index, level, tag, totalLevels, userID }: LevelProps) {
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
    <>
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
      {index + 1 !== totalLevels && <hr />}
    </>
  );
}
