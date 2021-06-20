import type { Snowflake } from 'discord-api-types';
import Link from 'next/link';

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
  return (
    <div
      className={`grid px-3 py-2 bg-discord-not-quite-black grid-areas-guild gap-x-2 rounded-md w-80 min-w-max ${
        total - 1 === index && index % 2 === 0 ? 'col-span-2' : ''
      }`}
    >
      <img
        alt={`${name} guild icon`}
        className="grid-in-icon rounded-lg"
        width={50}
        height={50}
        src={`https://cdn.discordapp.com/icons/${id}/${icon}.${icon.startsWith('a_') ? 'gif' : 'webp'}?size=64`}
      />

      <Link href={`https://discord.gg/${invite}`}>
        <a className="text-white hover:underline">{name}</a>
      </Link>

      <div className="grid-in-members flex justify-center items-center">
        <p className="text-gray-400 text-sm">{memberCount.toLocaleString('en')} members</p>
      </div>

      <div className="flex justify-self-end items-center grid-in-join">
        <Link href={`https://discord.gg/${invite}`}>
          <a className="text-white bg-green-500 px-4 py-2 rounded-sm text-xs">Join</a>
        </Link>
      </div>
    </div>
  );
}
