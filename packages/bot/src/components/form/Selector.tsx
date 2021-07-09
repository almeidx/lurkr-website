import type { Snowflake } from 'discord-api-types';
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';

import useClickOutside from '../../hooks/useClickOutside';
import { DEFAULT_ROLE_COLOUR } from '../../utils/constants';
import { resolveColour } from '../../utils/utils';
import Input from '../form/Input';

interface Channel {
  id: Snowflake;
  name: string;
}

interface Role extends Channel {
  color: number;
}

type Items = Channel[] | Role[];

export type OnSelectFn = (items: Snowflake[]) => unknown;

interface SelectorProps {
  disabled?: boolean;
  id: string;
  initialItems: Snowflake[];
  items: Items;
  limit: number;
  onSelect: OnSelectFn;
  type: 'channel' | 'role';
}

const resolveItem = (item: Channel | Role | null, type: SelectorProps['type']) =>
  type === 'channel'
    ? { id: item?.id, name: item?.name }
    : // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      ({ color: (item as Role).color, id: item?.id, name: item?.name } as Role);

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace JSX {
  interface IntrinsicElements {
    'data-id': string;
  }
}

export default function Selector({ id, limit, items, initialItems, onSelect, type, disabled }: SelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Items>([]);
  const [options, setOptions] = useState<Items>(items);
  const [searchTerm, setSearchTerm] = useState('');
  const elementRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => setDropdownOpen(false), []);

  useClickOutside(elementRef, handleClickOutside);

  const handleChannelRemove: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const id = (event.target as HTMLDivElement | HTMLParagraphElement).dataset.id as Snowflake;
      const clone = [...selected];
      const selectedIndex = clone.findIndex((s) => s.id === id);

      if (selectedIndex < 0) {
        return console.error("[Selector] Couldn't find item index when user tried removing an item");
      }

      clone.splice(selectedIndex, 1);
      onSelect(clone.map((i) => i.id));
      setSelected(clone);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected],
  );

  const handleClickedItem: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (selected.length >= limit) return;

      const id = (event.target as HTMLDivElement | HTMLParagraphElement).dataset.id as Snowflake;
      if (selected.some((s) => s.id === id)) return;

      const item = items.find((i) => i.id === id);
      if (!item) return console.error("[Selector] Couldn't find item when user tried adding an item");

      if (selected.length + 1 >= limit) setDropdownOpen(false);

      const newSelectedItems = [...selected, resolveItem(item, type) as Channel | Role];

      onSelect(newSelectedItems.map((i) => i.id));
      setSelected(newSelectedItems);
      setOptions([...options].filter((o) => o.id !== id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, limit, items, options],
  );

  useEffect(() => {
    const resolvedItems = initialItems
      .map((i) => resolveItem(items.find((it) => it.id === i) ?? null, type))
      .filter((i): i is Channel | Role => !!i.name);

    setSelected(resolvedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const searchableItems = items.filter((c) => !selected.some((s) => s.id === c.id));

    if (!searchTerm) {
      return setOptions(searchableItems);
    }

    setOptions(searchableItems.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selected]);

  return (
    <div className="relative" ref={elementRef}>
      <div className="flex flex-row flex-wrap gap-1.5 min-w-[15rem] min-h-[3rem] bg-discord-not-quite-black px-5 py-3 focus:outline-none rounded-md shadow">
        {selected.map((i) => (
          <div
            className={`${
              type === 'role' && 'role-bullet'
            } flex w-full-content items-center h-6 cursor-pointer z-50 border rounded-full text-xs select-none`}
            data-id={i.id}
            key={i.id}
            onClick={handleChannelRemove}
            style={{ borderColor: 'color' in i ? resolveColour(i.color) : DEFAULT_ROLE_COLOUR }}
          >
            <div className="role-x" data-id={i.id}>
              &times;
            </div>
            {type === 'role' && 'color' in i && (
              <div
                className="w-3 h-3 ml-[5px] mr-[4px] rounded-full"
                data-id={i.id}
                style={{ backgroundColor: resolveColour(i.color) }}
              />
            )}
            <div
              className={`text-white leading-3 truncate pr-2 pb-[2px] ${
                type === 'channel' ? 'hover:text-red-400' : ''
              }`}
              data-id={i.id}
            >
              {type === 'channel' && (
                <span className="pl-2" data-id={i.id}>
                  #
                </span>
              )}
              {i.name}
            </div>
          </div>
        ))}

        {selected.length < limit && (
          <AiOutlinePlusCircle
            className={`${
              disabled ? 'text-opacity-25' : ''
            } text-white hover:text-opacity-75 fill-current w-6 h-6 cursor-pointer`}
            onClick={() => (disabled ? null : setDropdownOpen(!dropdownOpen))}
          />
        )}
      </div>

      <div
        className={`${
          dropdownOpen ? '' : 'hidden'
        } absolute z-[99999] max-h-72 w-full mt-2 pb-3 bg-[#36393f] rounded-md`}
      >
        <div className="w-full">
          <Input
            className="p-3"
            id={id}
            initialValue={''}
            maxLength={50}
            onChange={(t) => setSearchTerm(t)}
            placeholder={`${type === 'channel' ? 'Channel' : 'Role'} name`}
          />
        </div>

        <div className="flex flex-col max-h-48 overflow-y-auto gap-0.5">
          {options.map((i) => (
            <div
              className="flex items-center text-left text-white px-3 mx-3 py-3 hover:bg-discord-lighter rounded-lg cursor-pointer"
              data-id={i.id}
              key={i.id}
              onClick={handleClickedItem}
            >
              {type === 'role' && 'color' in i && (
                <div
                  data-id={i.id}
                  className="w-4 h-4 rounded-full mr-2 select-none"
                  style={{ backgroundColor: resolveColour(i.color) }}
                />
              )}
              <div data-id={i.id} className="h-4 leading-4 select-none">
                {type === 'channel' && '#'}
                {i.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
