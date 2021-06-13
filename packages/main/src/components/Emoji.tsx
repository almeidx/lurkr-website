import type { Snowflake } from 'discord-api-types';
import Link from 'next/link';
import Tooltip from 'react-tooltip-lite';

import styles from '../styles/components/Emoji.module.scss';
import { DISCORD_EMOJI_CDN } from '../utils/constants';

interface EmojiProps {
  invite: string;
  id: Snowflake;
  name: string;
}

export default function Emoji({ invite, id, name }: EmojiProps) {
  return (
    <Tooltip background="var(--black)" color="var(--white)" content={`:${name}:`}>
      <Link key={id} href={`https://discord.gg/${invite}`}>
        <img
          className={styles.emojiImage}
          width={48}
          height={48}
          src={DISCORD_EMOJI_CDN(id, name.startsWith('a'))}
          alt={name}
        />
      </Link>
    </Tooltip>
  );
}
