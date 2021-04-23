import Link from 'next/link';
import { useContext } from 'react';
import type { IconType } from 'react-icons/lib';

import { GuildContext } from '../../contexts/GuildContext';
import styles from '../../styles/components/dashboard/AsideOption.module.scss';

export type Option = 'general' | 'leveling' | 'autorole' | 'misc';

export interface AsideOptionOptions {
  Icon: IconType;
  id: Option;
  name: string;
  path: string;
  selected: boolean;
}

export default function AsideOption({ Icon, id, name, path, selected }: AsideOptionOptions) {
  const { updateSelectedOption } = useContext(GuildContext);

  return (
    <Link href={`/guilds${path}`}>
      <span
        className={`${styles.container} ${selected ? styles.selected : ''}`}
        onClick={() => updateSelectedOption(id)}
      >
        <Icon /> {name}
      </span>
    </Link>
  );
}
