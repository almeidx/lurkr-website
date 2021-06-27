import type { Snowflake } from 'discord-api-types';
import Image from 'next/image';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import { BsFillShiftFill, BsPersonPlusFill } from 'react-icons/bs';
import { ImCog } from 'react-icons/im';

import { guildIconCdn } from '../../utils/cdn';
import { FALLBACK_AVATAR_PATH } from '../../utils/constants';

interface MenuProps {
  guild: {
    icon: string | null;
    id: Snowflake;
    name: string;
  };
}

interface MenuItem {
  Icon: IconType;
  name: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { Icon: ImCog, name: 'Settings', path: '' },
  { Icon: BsFillShiftFill, name: 'Leveling', path: 'leveling' },
  { Icon: BsPersonPlusFill, name: 'Auto Role', path: 'autorole' },
];

export default function Menu({ guild }: MenuProps) {
  return (
    <aside className="w-96 hidden sm:block">
      <header className="flex flex-row items-center mx-6 mb-8 mt-8 sm:mt-0 gap-4">
        {guild.icon ? (
          <img
            alt={`${guild.name} server icon`}
            className="rounded-full"
            height={64}
            src={guildIconCdn(guild.id, guild.icon, 64)}
            width={64}
          />
        ) : (
          <Image className="rounded-full" height={64} src={FALLBACK_AVATAR_PATH} width={64} />
        )}

        <p className="text-white truncate">{guild.name}</p>
      </header>

      <section className="flex flex-col items-center gap-3">
        {menuItems.map(({ Icon, name, path }, i) => (
          <Link href={`/guilds/${guild.id}/${path}`} key={i}>
            <a className="flex flex-row items-center gap-2 px-16 py-2 duration-200 hover:bg-discord-lighter focus:outline-none rounded-lg">
              <Icon className="text-white fill-current" />
              <span className="text-white">{name}</span>
            </a>
          </Link>
        ))}
      </section>
    </aside>
  );
}
