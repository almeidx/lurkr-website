import type { Snowflake } from 'discord-api-types';
import Link from 'next/link';

import useWindowDimensions from '../hooks/useWindowDimensions';
import { guildIconCdn } from '../utils/cdn';

interface GuildProps {
  icon: string;
  id: Snowflake;
  index: number;
  invite: string;
  memberCount: number;
  name: string;
  total: number;
}

export default function Guild({ icon, id, index, invite, memberCount, name, total }: GuildProps) {
  const { width } = useWindowDimensions();

  // Somewhat equivalent to sm
  const imgSize = typeof width === 'number' && width >= 640 ? 64 : 50;

  return (
    <div
      className={`grid px-3 py-2 bg-discord-not-quite-black grid-areas-guild gap-x-2 rounded-md w-80 sm:w-96 min-w-max ${
        total - 1 === index && index % 2 === 0 ? 'col-span-2' : ''
      }`}
    >
      <img
        alt={`${name} guild icon`}
        className="grid-in-icon rounded-lg"
        width={imgSize}
        height={imgSize}
        src={guildIconCdn(id, icon, 64)}
      />

      <Link href={`https://discord.gg/${invite}`}>
        <a className="grid-in-name text-white sm:text-lg hover:underline">{name}</a>
      </Link>

      <div className="grid-in-members flex justify-center items-center">
        <p className="text-gray-400 text-sm sm:text-base">{memberCount.toLocaleString('en')} members</p>
      </div>

      <div className="grid-in-join flex justify-self-end items-center">
        <Link href={`https://discord.gg/${invite}`}>
          <a className="text-white bg-discord-green hover:bg-discord-lighter-green duration-100 px-4 py-2 rounded-sm text-xs sm:text-sm">
            Join
          </a>
        </Link>
      </div>
    </div>
  );
}
