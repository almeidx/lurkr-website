/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import React, { ChangeEvent, FC } from 'react';
import type { ILevel } from '../@types';

import styles from './LevelCard.module.css';

const CDN_BASE = 'https://cdn.discordapp.com/avatars';
const DEFAULT_AVATAR_CDN = 'https://cdn.discordapp.com/embed/avatars';
const FALLBACK_AVATAR_PATH = '/static/fallback-avatar.png';

const LevelCard: FC<ILevel & { index: number }> = ({ avatar, id, level, tag, xp, index }) => {
  const onImageError = (event: ChangeEvent<HTMLImageElement>) => {
    event.target.onerror = null;
    event.target.src = FALLBACK_AVATAR_PATH;
  };

  const tagSplit = tag?.split('#');
  const discriminator = tagSplit && parseInt(tagSplit[tagSplit.length - 1], 10);

  return (
    <div className={styles.container}>
      <img
        width={128}
        height={128}
        src={
          avatar
            ? `${CDN_BASE}/${id}/${avatar}.${avatar.startsWith('a_') ? 'gif' : 'png'}?size=128`
            : tag && discriminator
            ? `${DEFAULT_AVATAR_CDN}/${discriminator % 5}.png`
            : FALLBACK_AVATAR_PATH
        }
        alt={`${tag ?? id}'s avatar`}
        onError={onImageError}
      />
      <p>
        {index + 1} - {tag ?? id} - {level} - {xp} xp
      </p>
    </div>
  );
};

export default LevelCard;
