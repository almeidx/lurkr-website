import type { Snowflake } from 'discord-api-types';
import { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from 'react-icons/ai';

import { DEFAULT_ROLE_COLOUR } from '../../utils/constants';
import { resolveColour } from '../../utils/utils';
import Input from '../Input';

interface Channel {
  id: Snowflake;
  name: string;
}

interface Role extends Channel {
  color: number;
}

type Items = Channel[] | Role[];

interface SelectorProps {
  limit: number;
  initialItems: Snowflake[];
  items: Items;
  onSelect: (itemId: Snowflake, type: 'add' | 'remove') => unknown;
  type: 'channel' | 'role';
}

const resolveItem = (item: Channel | Role | null, type: SelectorProps['type']) =>
  type === 'channel'
    ? { id: item?.id, name: item?.name }
    : // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      ({ color: (item as Role).color, id: item?.id, name: item?.name } as Role);

export default function Selector({ limit, items, initialItems, onSelect, type }: SelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Items>([]);
  const [options, setOptions] = useState<Items>(items);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChannelRemove: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const id = (event.target as HTMLDivElement | HTMLParagraphElement).id as Snowflake;
      const clone = [...selected];
      const selectedIndex = clone.findIndex((s) => s.id === id);

      if (selectedIndex < 0) {
        return console.error("[Selector] Couldn't find item index when user tried removing an item");
      }

      onSelect(id, 'remove');
      clone.splice(selectedIndex, 1);
      setSelected(clone);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected],
  );

  const handleClickedItem: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (selected.length >= limit) return;

      const id = (event.target as HTMLDivElement | HTMLParagraphElement).id as Snowflake;
      if (selected.some((s) => s.id === id)) return;

      const item = items.find((i) => i.id === id);
      if (!item) return console.error("[Selector] Couldn't find item when user tried adding an item");

      if (selected.length + 1 >= limit) setDropdownOpen(false);
      onSelect(id, 'add');
      setSelected([...selected, resolveItem(item, type) as Channel | Role]);
      setOptions([...options].filter((o) => o.id !== id));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, limit, items, options],
  );

  useEffect(() => {
    const resolvedItems = initialItems
      .map((i) => resolveItem(items.find((it) => it.id === i) ?? null, type))
      .filter((i) => !!i.name) as Items;

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
    <div>
      <div className="flex flex-row flex-wrap gap-3 min-h-[3rem] bg-discord-not-quite-black px-5 py-3 focus:outline-none rounded-md shadow">
        {selected.map((i) => (
          <div
            className="flex items-center font-light border-2 rounded-2xl px-1.5 py-1 max-w-full cursor-pointer z-50"
            key={i.id}
            id={i.id}
            onClick={handleChannelRemove}
            style={{ borderColor: 'color' in i ? resolveColour(i.color) : DEFAULT_ROLE_COLOUR }}
          >
            {type === 'role' && 'color' in i && (
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: resolveColour(i.color) }} />
            )}
            <p className="text-white truncate" id={i.id}>
              {type === 'channel' && '#'}
              {i.name}
            </p>
          </div>
        ))}

        {selected.length < limit &&
          (dropdownOpen ? (
            <AiOutlineCloseCircle
              className="text-red-500 fill-current w-9 h-9 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
          ) : (
            <AiOutlinePlusCircle
              className="text-white fill-current w-9 h-9 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
          ))}
      </div>

      <div
        className={`${
          dropdownOpen ? '' : 'hidden'
        } relative h-64 w-full bg-[#36393f] flex flex-col items-center pt-4 mt-2 rounded-md`}
      >
        <div className="px-4">
          <Input
            className="pb-3"
            id="selector"
            maxLength={50}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            placeholder={`${type === 'channel' ? 'Channel' : 'Role'} name`}
            value={searchTerm}
          />
        </div>

        <div className="flex flex-col overflow-y-scroll w-full h-full mb-2 gap-1">
          {options.map((i) => (
            <div
              className="flex items-center text-center px-4 py-2 hover:bg-discord-lighter rounded-lg cursor-pointer"
              key={i.id}
              id={i.id}
              onClick={handleClickedItem}
            >
              {type === 'role' && 'color' in i && (
                <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: resolveColour(i.color) }} />
              )}

              <p className="text-white" id={i.id}>
                {type === 'channel' && '#'}
                {i.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
