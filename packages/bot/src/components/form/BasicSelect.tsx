import { MouseEventHandler, useCallback, useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';

interface BasicSelectProps {
  closeOnSelect?: boolean;
  initialItem: string;
  items: string[];
  onSelect: (item: string) => unknown;
}

export default function BasicSelect({ closeOnSelect = false, initialItem, items, onSelect }: BasicSelectProps) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(initialItem);

  const handleItemChange: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const index = parseInt((event.target as HTMLDivElement | HTMLParagraphElement).id, 10);
      const item = items[index];

      if (!item) return console.error("[BasicSelect] Couldn't find the item when user tried changing item");

      onSelect(item);
      setSelected(item);
      if (closeOnSelect) setDropdownOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  );

  return (
    <div className="cursor-pointer">
      <div
        className="flex flex-row flex-wrap gap-1.5 min-h-[3rem] w-64 bg-discord-not-quite-black px-5 py-3 focus:outline-none rounded-md shadow relative"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="flex items-center px-1.5 py-1 max-w-full cursor-pointer z-50 text-white leading-3">
          {selected}
        </span>

        <div className="absolute right-0 my-auto mx-4 text-2xl text-white transition-colors h-full cursor-pointer">
          <AiFillCaretDown />
        </div>
      </div>

      <div
        className={`${
          dropdownOpen ? '' : 'hidden'
        } relative h-64 w-full bg-[#36393f] flex flex-col items-center pt-4 mt-2 rounded-md`}
      >
        <div className="flex flex-col overflow-y-scroll w-full h-full mb-2 gap-1">
          {items.map((name, i) => (
            <div
              className="flex items-center text-center px-4 py-2 hover:bg-discord-lighter rounded-lg cursor-pointer"
              key={i.toString()}
              id={i.toString()}
              onClick={handleItemChange}
            >
              <p className="text-white" id={i.toString()}>
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
