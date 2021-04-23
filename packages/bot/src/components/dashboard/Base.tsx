import type { Snowflake } from 'discord-api-types';
import { ReactNode, useContext, useState } from 'react';
import { BsConeStriped, BsFillShiftFill, BsPersonPlusFill } from 'react-icons/bs';
import { RiSoundModuleFill } from 'react-icons/ri';

import { GuildContext } from '../../contexts/GuildContext';
import styles from '../../styles/components/dashboard/Base.module.scss';
import { DISCORD_GUILD_CDN, FALLBACK_AVATAR } from '../../utils/constants';
import AsideOption, { AsideOptionOptions, Option } from './AsideOption';

interface BaseOptions {
  children: ReactNode;
  option: Option;
  guild: {
    id: Snowflake;
    name: string;
    icon: string | null;
  };
}

const asideOptions: Omit<AsideOptionOptions, 'selected'>[] = [
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

export default function Base({ children, guild, option }: BaseOptions) {
  const { changes, saveGuildChanges } = useContext(GuildContext);
  const [saveButtonContent, setSaveButtonContent] = useState<string>('Save');

  async function handleSaveButtonClick() {
    setSaveButtonContent('Saving...');
    await saveGuildChanges();
    setSaveButtonContent('Saved!');
    setTimeout(() => setSaveButtonContent('Save'), 5000);
  }

  return (
    <div className={styles.container}>
      <header>
        <img src={DISCORD_GUILD_CDN(guild.id, guild.icon) ?? FALLBACK_AVATAR} alt={`${guild.name} icon`} />
        <span>{guild.name}</span>
      </header>

      <button className={styles.saveButton} disabled={!Object.keys(changes).length} onClick={handleSaveButtonClick}>
        {saveButtonContent}
      </button>

      <main className={styles.mainContent}>
        <aside className={styles.asideOptionsContainer}>
          {asideOptions.map(({ Icon, id, name, path }) => (
            <AsideOption
              key={id}
              Icon={Icon}
              id={id}
              name={name}
              path={`/${guild.id}/${path}`}
              selected={option === id}
            />
          ))}
        </aside>

        <section className={styles.childrenContainer}>{children}</section>
      </main>
    </div>
  );
}
