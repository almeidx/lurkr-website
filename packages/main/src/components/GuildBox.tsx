import type { Snowflake } from 'discord-api-types';
import { FaSignInAlt } from 'react-icons/fa';

import styles from '../styles/components/GuildBox.module.scss';
import { DISCORD_GUILD_CDN, FALLBACK_AVATAR } from '../utils/constants';

interface GuildBoxProps {
  id: Snowflake;
  name: string;
  memberCount: number;
  invite: string;
  icon: string;
}

export default function GuildBox({ icon, id, invite, memberCount, name }: GuildBoxProps) {
  return (
    <div className={styles.container}>
      <div>
        <img width={50} height={50} src={DISCORD_GUILD_CDN(id, icon) ?? FALLBACK_AVATAR} alt={`${name} icon`} />
        <p>{name}</p>
      </div>

      <p>{memberCount.toLocaleString()} members</p>

      <button className={styles.joinButton} onClick={() => window.open(`https://discord.gg/${invite}`)} type="button">
        Join <FaSignInAlt />
      </button>
    </div>
  );
}
