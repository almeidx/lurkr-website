import type { Snowflake } from 'discord-api-types';
import Image from 'next/image';
import { useContext } from 'react';
import type { IconType } from 'react-icons';
import { BsFillShiftFill, BsPersonPlusFill } from 'react-icons/bs';
import { ImCog } from 'react-icons/im';

import { GuildChangesContext, Section } from '../../contexts/GuildChangesContext';
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
  id: Section;
  name: string;
}

const menuItems: MenuItem[] = [
  { Icon: ImCog, id: 'general', name: 'Settings' },
  { Icon: BsFillShiftFill, id: 'leveling', name: 'Leveling' },
  { Icon: BsPersonPlusFill, id: 'autorole', name: 'Auto Role' },
];

export default function Menu({ guild }: MenuProps) {
  const { section, updateSection } = useContext(GuildChangesContext);

  return (
    <aside className="w-96 px-6 hidden sm:block">
      <header className="flex flex-row items-center mb-8 mt-8 sm:mt-0 gap-4">
        {guild.icon ? (
          <img
            alt={`${guild.name} server icon`}
            className="rounded-full"
            height={48}
            src={guildIconCdn(guild.id, guild.icon, 64)}
            width={48}
          />
        ) : (
          <Image className="rounded-full" height={48} src={FALLBACK_AVATAR_PATH} width={48} />
        )}

        <p className="text-white truncate">{guild.name}</p>
      </header>

      <section className="flex flex-col items-center gap-y-3">
        {menuItems.map(({ Icon, id, name }, i) => (
          <div
            className={`${
              section === id ? 'bg-gray-500' : ''
            } flex flex-row items-center justify-center gap-2 py-2 w-full text-center duration-200 hover:bg-discord-lighter text-white focus:outline-none rounded-lg cursor-pointer`}
            key={i}
            onClick={() => updateSection(id)}
          >
            <Icon className="fill-current" />
            {name}
          </div>
        ))}
      </section>
    </aside>
  );
}
