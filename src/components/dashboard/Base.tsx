import { ReactNode, useContext } from 'react';
import { BsConeStriped, BsFillShiftFill, BsPersonPlusFill } from 'react-icons/bs';
import { RiSoundModuleFill } from 'react-icons/ri';

import { GuildContext, GuildWithChannels } from '../../contexts/GuildContext';
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
    Icon: BsFillShiftFill,
    id: 'leveling',
    name: 'Leveling',
    path: 'leveling',
  },
  {
    Icon: BsPersonPlusFill,
    id: 'autorole',
    name: 'Autorole',
    path: 'autorole',
  },
  {
    Icon: BsConeStriped,
    id: 'misc',
    name: 'Miscellaneous',
    path: 'misc',
  },
];

export default function Base({ children, guild }: BaseOptions) {
  const { changes, saveGuildChanges } = useContext(GuildContext);

  return (
    <div className={styles.container}>
      <header>
        <img src={DISCORD_GUILD_CDN(guild.id, guild.icon) ?? FALLBACK_AVATAR} alt={`${guild.name} icon`} />
        <span>{guild.name}</span>
      </header>

      {changes.length ? <button onClick={() => saveGuildChanges()}>Save</button> : null}

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
