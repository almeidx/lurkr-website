import type { Snowflake } from 'discord-api-types';

import { emojiCdn } from '../utils/cdn';

interface EmojiProps {
  animated: boolean;
  id: Snowflake;
  invite: string;
  name: string;
}

export default function Emoji({ animated, id, invite, name }: EmojiProps) {
  return (
    <div className="group relative w-max h-max cursor-pointer">
      <img
        width={48}
        height={48}
        src={emojiCdn(id, animated)}
        className="w-12"
        onClick={() => window.open(`https://discord.gg/${invite}`)}
      />

      <div
        onClick={() => void navigator.clipboard.writeText(`:${name}:`)}
        className="group absolute hidden group-hover:block bottom-full bg-black active:bg-gray-800 transition-colors rounded-md left-1/2 -translate-x-1/2"
      >
        <p className="text-white py-1 px-1.5 ">{`:${name}:`}</p>
        <div className="relative">
          <div className="absolute border-4 border-black group-active:border-gray-800 transition-colors rotate-45 -top-1 left-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
