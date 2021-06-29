import type { Snowflake } from 'discord-api-types';
import { MouseEventHandler, useEffect, useState } from 'react';
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from 'react-icons/ai';

import { DEFAULT_ROLE_COLOUR } from '../../utils/constants';
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
  items: Items;
  onSelect: (itemId: Snowflake, type: 'add' | 'remove') => unknown;
  initialItems: Snowflake[];
  type: 'channel' | 'role';
}

export default function Selector({ items, initialItems, onSelect, type }: SelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<Items>([]);
  const [options, setOptions] = useState<Items>(items);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChannelRemove: MouseEventHandler<HTMLDivElement> = (event) => {
    const id = (event.target as HTMLDivElement | HTMLParagraphElement).id as Snowflake;
    const clone = [...selected];
    const selectedIndex = clone.findIndex((s) => s.id === id);

    if (selectedIndex < 0) return console.log('couldnt find item index??!');

    onSelect(id, 'remove');
    clone.splice(selectedIndex, 1);
    setSelected(clone);
  };

  const handleClickedItem: MouseEventHandler<HTMLDivElement> = (event) => {
    const id = (event.target as HTMLDivElement | HTMLParagraphElement).id as Snowflake;
    if (selected.some((s) => s.id === id)) return;

    const item = items.find((i) => i.id === id);
    if (!item) return console.log('no item bruh???');

    onSelect(id, 'add');
    setSelected([...selected, { id, name: item.name }]);
    setOptions([...options].filter((o) => o.id !== id));
  };

  useEffect(() => {
    const resolvedItems = initialItems
      .map((i) => ({
        id: i,
        name: items.find((it) => it.id === i)?.name,
      }))
      .filter((i) => !!i.name) as Items;

    setSelected(resolvedItems);
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
        {selected.map(({ id, name }) => (
          <div
            className={`flex items-center font-light border-2 border-[${DEFAULT_ROLE_COLOUR}] rounded-2xl px-1.5 py-1 max-w-full cursor-pointer z-50`}
            key={id}
            id={id}
            onClick={handleChannelRemove}
          >
            <p className="text-white truncate" id={id}>
              {type === 'channel' && '#'}
              {name}
            </p>
          </div>
        ))}

        {dropdownOpen ? (
          <AiOutlineCloseCircle
            className="text-red-500 fill-current w-9 h-9 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
        ) : (
          <AiOutlinePlusCircle
            className="text-white fill-current w-9 h-9 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
        )}
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
          {options.map(({ id, name }) => (
            <div
              className="flex text-center px-4 py-2 hover:bg-discord-lighter rounded-lg cursor-pointer"
              key={id}
              id={id}
              onClick={handleClickedItem}
            >
              <p className="text-white" id={id}>
                {type === 'channel' && '#'}
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
