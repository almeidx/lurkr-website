import type { Snowflake } from 'discord-api-types';
import Image from 'next/image';
import type { ChangeEvent } from 'react';

import { FALLBACK_AVATAR_PATH, XP } from '../../utils/constants';

interface UserProps {
  avatar: string | null;
  index: number;
  level: number;
  tag: string | null;
  userID: Snowflake;
  xp: number;
}

const makeUserAvatarLink = (id: Snowflake, hash: string | null, tag: string | null) =>
  hash
    ? `https://cdn.discordapp.com/avatars/${id}/${hash}.webp?size=64`
    : tag
    ? `https://cdn.discordapp.com/avatars/${Number(tag.split(/#(\d{4})$/)[1])}.webp?size=64`
    : FALLBACK_AVATAR_PATH;

export default function User({ avatar, index, level, tag, userID, xp }: UserProps) {
  const currentLevelRequiredXp = XP(level);
  const nextLevelRequiredXp = XP(level + 1);
  const levelXp = nextLevelRequiredXp - currentLevelRequiredXp;
  const userXp = xp - currentLevelRequiredXp;
  const percentage = userXp / levelXp;

  return (
    <div className="flex flex-row justify-between px-6 py-4 rounded-lg" key={userID}>
      <div className="flex flex-row justify-center items-center gap-6">
        <div className="flex justify-center items-center w-14">
          <span
            className={`text-white px-3 py-1 rounded-full w-8 flex justify-center items-center ${
              index >= 3 ? 'bg-[#15181c]' : index === 2 ? 'bg-[#a54e00]' : index === 1 ? 'bg-[#cad5db]' : 'bg-[#faa61a]'
            }`}
          >
            {index + 1}
          </span>
        </div>

        {avatar || tag ? (
          <img
            alt={`${tag} avatar`}
            className="rounded-full"
            height={64}
            src={makeUserAvatarLink(userID, avatar, tag)}
            width={64}
            onError={(e: ChangeEvent<HTMLImageElement>) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_AVATAR_PATH;
            }}
          />
        ) : (
          <Image className="rounded-full" height={64} src={FALLBACK_AVATAR_PATH} width={64} />
        )}

        <p className="text-gray-200">{tag ?? userID}</p>
      </div>

      <div className="flex flex-row justify-center items-center w-64 bg-discord-dark rounded-full gap-x-4 my-3 relative">
        <div className="absolute bg-blurple left-0 h-full rounded-full" style={{ width: percentage * 256 }} />

        <span className="text-white text-xl z-30">XP • {xp.toLocaleString('en')}</span>
        <span className="text-white text-xl z-30">LVL • {level.toLocaleString('en')}</span>
      </div>
    </div>
  );
}
