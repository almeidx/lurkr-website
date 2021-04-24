import type { Snowflake } from 'discord-api-types';
import { KeyboardEvent, useRef, useState } from 'react';

import styles from '../styles/components/Selector.module.scss';

const colorToRGB = (color: number) => {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;

  return `rgb(${r}, ${g}, ${b})`;
};

interface Role {
  id: Snowflake;
  name: string;
  color: number;
}

interface SelectorProps {
  limit: number;
  roles: Role[];
  onSelect(state: Snowflake[], changed: Snowflake): any;
}

export default function Selector(props: SelectorProps) {
  const input = useRef<HTMLDivElement | null>(null);
  const [selected] = useState(new Set<Snowflake>());
  const [search, setSearch] = useState('');
  const [, setState] = useState({});

  const onFocus = () => {
    input.current?.focus();
  };

  const onInput = () => {
    if (input.current) setSearch(input.current.innerText.toLowerCase());
  };

  const onBackspace = ({ key }: KeyboardEvent<HTMLDivElement>) => {
    if (key === 'Backspace' && !input.current?.innerText.length) {
      selected.delete(Array.from(selected).pop()!);
      setState({}); // Trigger force update.
    }
  };

  const onSelect = (role: Snowflake) => {
    if (selected.has(role)) {
      selected.delete(role);
    } else if (selected.size < props.limit) {
      selected.add(role);
    }

    setState({}); // Trigger force update.
    props.onSelect(Array.from(selected), role);
    input.current?.focus();
  };

  const itemsSelected = props.roles.filter((role) => selected.has(role.id));

  const itemsFound = search.length
    ? props.roles.filter((role) => !selected.has(role.id) && role.name.toLowerCase().includes(search))
    : [];

  return (
    <div className={styles.roleSelector}>
      <div className={styles.roleSelectorBase} onClick={onFocus}>
        {itemsSelected.map(({ id, name, color }, i) => (
          <div
            className={styles.roleSelectorInline}
            style={{ borderColor: colorToRGB(color) }}
            onClick={() => onSelect(id)}
            key={i}
          >
            <div className={styles.roleSelectorCircle} style={{ backgroundColor: colorToRGB(color) }} />
            <span>{name}</span>
          </div>
        ))}

        <div
          className={styles.roleSelectorInput}
          contentEditable="true"
          onInput={onInput}
          onKeyDown={onBackspace}
          ref={input}
        />
      </div>

      <div className={styles.roleSelectorList}>
        {itemsFound.map(({ id, name, color }, i) => (
          <div className={styles.roleSelectorRole} onClick={() => onSelect(id)} key={i}>
            <div className={styles.roleSelectorCircle} style={{ backgroundColor: colorToRGB(color) }} /> {name}
          </div>
        ))}
      </div>
    </div>
  );
}
