import Link from 'next/link';
import { useContext, useEffect, useRef } from 'react';
import type { IconType } from 'react-icons/lib';

import { GuildContext } from '../../contexts/GuildContext';
import styles from '../../styles/components/dashboard/AsideOption.module.css';

export interface AsideOptionOptions {
  Icon: IconType;
  id: string;
  name: string;
  path: string;
}

export default function AsideOption({ Icon, id, name, path }: AsideOptionOptions) {
  const { selectedOption, updateSelectedOption } = useContext(GuildContext);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current && selectedOption === id) {
      spanRef.current.classList.add(styles.selected);
    }
  }, [spanRef, id, selectedOption]);

  return (
    <Link href={`/guilds${path}`}>
      <span className={styles.container} ref={spanRef} onClick={() => updateSelectedOption(id)}>
        <Icon /> {name}
      </span>
    </Link>
  );
}
