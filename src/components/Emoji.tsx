import { useContext } from 'react';
import Link from 'next/link';
import { SearchBarContext } from '../contexts/SearchBarContext';
import { DISCORD_EMOJI_CDN, Snowflake } from '../utils/constants';
import styles from '../styles/components/Emoji.module.css';
import Tooltip from 'react-tooltip-lite';

interface EmojiProps {
  invite: string;
  id: Snowflake;
  name: string;
}

export default function Emoji({ invite, id, name }: EmojiProps) {
  const { isSearchLoading, updateSearchLoading } = useContext(SearchBarContext);

  return (
    <Tooltip background="var(--black)" color="var(--white)" content={`:${name}:`}>
      <Link key={id} href={`https://discord.gg/${invite}`}>
        <img
          className={styles.emojiImage}
          width={48}
          height={48}
          src={DISCORD_EMOJI_CDN(id, name.startsWith('a'))}
          alt={name}
          onLoad={() => isSearchLoading && updateSearchLoading(false)}
        />
      </Link>
    </Tooltip>
  );
}
