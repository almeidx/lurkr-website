import type { Snowflake } from 'discord-api-types';
import { ChangeEvent, Component, createRef, RefObject } from 'react';

import styles from '../styles/components/Selector.module.css';

const colorToRGB = (color: number) => {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;

  return `rgb(${r}, ${g}, ${b})`;
};

interface Role {
  id: string;
  name: string;
  color: number;
}

interface SelectorProps {
  roles: Role[];
  onSelect(state: Snowflake[], changed: Snowflake): any;
}

interface SelectorStates {
  selected: Set<string>;
  search: string;
}

export default class Selector extends Component<SelectorProps, SelectorStates> {
  public input: RefObject<any>;

  // @ts-ignore
  public constructor(props) {
    super(props);
    this.input = createRef();
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      search: '',
      selected: new Set(),
    };
  }

  //  INPUT

  public onFocus() {
    this.input.current.focus();
  }

  public onType({ target }: ChangeEvent<HTMLDivElement>) {
    this.setState({
      search: target.innerText.toLowerCase(),
    });
  }

  //  ROLES

  public onSelect(role: string) {
    this.state.selected.has(role) ? this.state.selected.delete(role) : this.state.selected.add(role);

    // @ts-ignore
    this.props.onSelect(this.state.selected, role);
    this.input.current.focus();
    this.forceUpdate();
  }

  //  RENDER

  public render() {
    const search = this.props.roles.filter((role) => {
      return !this.state.selected.has(role.id) && role.name.toLowerCase().includes(this.state.search);
    });

    const selected = this.props.roles.filter((role) => {
      return this.state.selected.has(role.id);
    });

    return (
      <div className={styles.roleSelector}>
        <div className={styles.roleSelectorBase} onClick={this.onFocus.bind(this)}>
          {selected.map(({ id, name, color }, i) => (
            <div
              className={styles.roleSelectorInline}
              style={{ borderColor: colorToRGB(color) }}
              onClick={this.onSelect.bind(this, id)}
              key={i}
            >
              <div className={styles.roleSelectorCircle} style={{ backgroundColor: colorToRGB(color) }} />
              <span>{name}</span>
            </div>
          ))}

          <div
            className={styles.roleSelectorInput}
            contentEditable="true"
            onInput={this.onType.bind(this)}
            ref={this.input}
          />
        </div>

        <div className={styles.roleSelectorList}>
          {search.map(({ id, name, color }, i) => (
            <div className={styles.roleSelectorRole} onClick={this.onSelect.bind(this, id)} key={i}>
              <div className={styles.roleSelectorCircle} style={{ backgroundColor: colorToRGB(color) }} /> {name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// import type { Snowflake } from 'discord-api-types';
// import React, { ChangeEvent, useRef, useState } from 'react';

// const colorToRGB = (color: number) => {
//   const r = (color >> 16) & 0xff;
//   const g = (color >> 8) & 0xff;
//   const b = color & 0xff;

//   return `rgb(${r}, ${g}, ${b})`;
// }

// interface Role {
//   color: number;
//   id: Snowflake
//   name: string;
// }

// interface SelectorProps {
//   roles: Role[]
// }

// export default function Selector({ roles }: SelectorProps) {
//   const inputRef = useRef<HTMLDivElement>(null);
//   const [selected, setSelected] = useState(new Set());
//   const [search, setSearch] = useState<string>('');

//   function handleSearchChange(event: ChangeEvent<HTMLDivElement>) {
//     setSearch(event.target.innerText.toLowerCase());
//   }

//   onSelect(role) {
//     this.state.selected.has(role)
//     ? this.state.selected.delete(role)
//     : this.state.selected.add(role);

//     this.props.onSelect(this.state.selected, role);
//     this.input.current.focus();
//     this.forceUpdate();
//   }

//   //  RENDER

//     const tempSearch = roles.filter((role) => !selected.has(role.id) && role.name.toLowerCase().includes(search));

//     const tempSelected = roles.filter((role) => selected.has(role.id));

//     return (
//       <div className={styles.roleSelector} onFocus={() => inputRef.current?.focus()}>
//         <div className={styles.roleSelectorBase} onClick={() => inputRef.current?.focus()}>
//           {selected.map(({ id, name, color }, i) => {
//             color = colorToRGB(color);

//             return (
//               <div
//                 className={styles.roleSelectorInline}
//                 style={{ borderColor: color }}
//                 onClick={this.onSelect.bind(this, id)}
//                 key={i}
//               >
//                 <div className={styles.roleSelectorCircle} style={{ backgroundColor: color }} />
//                 <span>{name}</span>
//               </div>
//             );
//           })}

//           <div
//             className={styles.roleSelectorInput}
//             contentEditable="true"
//             onInput={handleSearchChange}
//             ref={inputRef}
//           />
//         </div>

//         <div className={styles.roleSelectorList}>
//           {search.map(({ id, name, color }, i) => {
//             color = colorToRGB(color);

//             return (
//               <div className={styles.roleSelectorRole} onClick={this.onSelect.bind(this, id)} key={i}>
//                 <div className={styles.roleSelectorCircle} style={{ backgroundColor: color }} /> {name}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
// }
