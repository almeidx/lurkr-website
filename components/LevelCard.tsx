import React, { ChangeEvent, FC, useEffect, useRef } from 'react';
import type { ILevel } from '../typings';
import styles from './LevelCard.module.css';

const CDN_BASE = 'https://cdn.discordapp.com/avatars';
const DEFAULT_AVATAR_CDN = 'https://cdn.discordapp.com/embed/avatars';
const FALLBACK_AVATAR_PATH = '/static/fallback-avatar.png';

export enum Colors {
  GOLD = '#faa61a',
  SILVER = '#cad5db',
  BRONZE = '#a54e00',
  REST = '#15181c',
}

/**
 * Gets the XP required to achieve a level
 * @info un = 100 + 50 * (n - 1) ** 2
 * @param n The level
 * @returns The XP required
 */
const XP = (n: number): number => (n === 0 ? 0 : 100 + 50 * (n - 1) ** 2);

const LevelCard: FC<ILevel & { index: number; colour: Colors }> = ({ avatar, colour, id, level, tag, xp, index }) => {
  const progressRef = useRef<HTMLDivElement>(null);

  const currentLevelRequiredXp = XP(level);
  const nextLevelRequiredXp = XP(level + 1);
  const percentage = (xp - currentLevelRequiredXp) / (nextLevelRequiredXp - currentLevelRequiredXp);

  const tagSplit = tag?.split('#');
  const discriminator = tagSplit && parseInt(tagSplit[tagSplit.length - 1], 10);
  const avatarURL = avatar
    ? `${CDN_BASE}/${id}/${avatar}.${avatar.startsWith('a_') ? 'gif' : 'png'}?size=128`
    : tag && discriminator
    ? `${DEFAULT_AVATAR_CDN}/${discriminator % 5}.png`
    : FALLBACK_AVATAR_PATH;

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `calc(${percentage} * 30vw)`;
    }
  }, [percentage]);

  const onImageError = (event: ChangeEvent<HTMLImageElement>) => {
    event.target.onerror = null;
    event.target.src = FALLBACK_AVATAR_PATH;
  };

  return (
    <div className={styles.container}>
      <span className={styles.index} style={{ backgroundColor: colour }}>
        {index + 1}
      </span>

      <div className={styles['mid-wrapper']}>
        <div className={styles['mid-background']} ref={progressRef}>
          <img width={128} height={128} src={avatarURL} alt={`${tag ?? id}'s avatar`} onError={onImageError} />
          <span>{tag ?? id}</span>
        </div>
      </div>

      <span className={styles.level}>Level {level}</span>
    </div>
  );
};

export default LevelCard;
