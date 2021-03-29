import type { ReactNode } from 'react';
import { RiSoundModuleFill } from 'react-icons/ri';

import type { GuildWithChannels } from '../../contexts/GuildContext';
import styles from '../../styles/components/dashboard/Base.module.css';
import { DISCORD_GUILD_CDN, FALLBACK_AVATAR } from '../../utils/constants';
import AsideOption, { AsideOptionOptions } from './AsideOption';

interface BaseOptions {
  children: ReactNode;
  guild: GuildWithChannels;
}

const asideOptions: AsideOptionOptions[] = [
  {
    Icon: RiSoundModuleFill,
    id: 'general',
    name: 'General',
    path: '',
  },
  {
    Icon: RiSoundModuleFill,
    id: 'leveling',
    name: 'Leveling',
    path: 'leveling',
  },
  {
    Icon: RiSoundModuleFill,
    id: 'autorole',
    name: 'Autorole',
    path: 'autorole',
  },
  {
    Icon: RiSoundModuleFill,
    id: 'misc',
    name: 'Miscellaneous',
    path: 'misc',
  },
];

export default function Base({ children, guild }: BaseOptions) {
  return (
    <div className={styles.container}>
      <header>
        <img src={DISCORD_GUILD_CDN(guild.id, guild.icon) ?? FALLBACK_AVATAR} alt={`${guild.name} icon`} />
        <span>{guild.name}</span>
      </header>

      <main>
        <aside>
          {asideOptions.map(({ Icon, id, name, path }) => (
            <AsideOption key={id} Icon={Icon} id={id} name={name} path={`/${guild.id}/${path}`} />
          ))}
        </aside>

        <section>{children}</section>
      </main>
    </div>
  );
}
