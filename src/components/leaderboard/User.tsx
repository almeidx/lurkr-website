import Image from 'next/image';
import type { ChangeEvent } from 'react';

import useWindowDimensions from '../../hooks/useWindowDimensions';
import { userAvatarCdn, userDefaultAvatarCdn } from '../../utils/cdn';
import { type Snowflake, FALLBACK_AVATAR_PATH, XP } from '../../utils/constants';

interface UserProps {
  avatar: string | null;
  index: number;
  level: number;
  tag: string | null;
  userId: Snowflake;
  xp: number;
}

const makeUserAvatarUrl = (id: Snowflake, hash: string | null, tag: string | null) =>
  hash
    ? userAvatarCdn(id, hash, 64, false)
    : tag
    ? userDefaultAvatarCdn(tag.split(/#(\d{4})$/)[1], 64)
    : FALLBACK_AVATAR_PATH;

export default function User({ avatar, index, level, tag, userId, xp }: UserProps) {
  const { width } = useWindowDimensions();

  const currentLevelRequiredXp = XP(level);
  const nextLevelRequiredXp = XP(level + 1);
  const levelXp = nextLevelRequiredXp - currentLevelRequiredXp;
  const userXp = xp - currentLevelRequiredXp;
  const percentage = userXp / levelXp;

  return (
    <div className="flex flex-row justify-between rounded-lg py-4 px-6" key={userId}>
      <div className="flex flex-row items-center justify-center gap-6">
        <div className="flex w-14 items-center justify-center">
          <span
            className={`flex w-8 items-center justify-center rounded-full px-3 py-1 text-white ${
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
            src={makeUserAvatarUrl(userId, avatar, tag)}
            width={64}
            onError={(e: ChangeEvent<HTMLImageElement>) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_AVATAR_PATH;
            }}
          />
        ) : (
          <Image className="rounded-full" height={64} src={FALLBACK_AVATAR_PATH} width={64} />
        )}

        <p className="text-gray-200">{tag ?? userId}</p>
      </div>

      {typeof width === 'number' && width >= 648 && (
        <div className="relative my-3 flex w-64 flex-row items-center justify-center gap-x-4 rounded-full bg-discord-dark">
          <div
            className="absolute left-0 h-full rounded-full bg-blurple"
            style={{ width: percentage < 0.2 ? 42 : percentage * 256 }}
          />

          <span className="z-30 text-xl text-white">XP • {xp.toLocaleString('en')}</span>
          <span className="z-30 text-xl text-white">LVL • {level.toLocaleString('en')}</span>
        </div>
      )}
    </div>
  );
}
