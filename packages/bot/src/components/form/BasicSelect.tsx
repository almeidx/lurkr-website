import { MouseEventHandler, useCallback, useRef, useState } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';

import useClickOutside from '../../hooks/useClickOutside';

interface BasicSelectProps {
  closeOnSelect?: boolean;
  initialItem: string;
  items: string[];
  disabled?: boolean;
  onSelect: (item: string) => unknown;
}

export default function BasicSelect({
  closeOnSelect = false,
  initialItem,
  items,
  disabled,
  onSelect,
}: BasicSelectProps) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>(initialItem);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(() => setDropdownOpen(false), []);

  useClickOutside(elementRef, handleClickOutside);

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
    <div ref={elementRef} className={`relative text-white ${disabled ? 'text-opacity-25' : 'cursor-pointer'}`}>
      <div
        className="flex flex-row flex-wrap gap-1.5 h-12 w-64 px-5 py-3 bg-discord-not-quite-black focus:outline-none rounded-md shadow"
        onClick={() => (disabled ? null : setDropdownOpen(!dropdownOpen))}
      >
        <span className="flex items-center max-w-full px-1.5 py-1 leading-3 cursor-pointer z-50 ">{selected}</span>

        <div className="absolute right-0 my-auto mx-4 text-2xl  transition-colors h-full cursor-pointer">
          <AiFillCaretDown />
        </div>
      </div>

      <div
        className={`${
          dropdownOpen ? '' : 'hidden'
        } absolute z-[99999] max-h-64 w-full bg-[#36393f] flex flex-col items-center mt-2 rounded-md`}
      >
        <div className="flex flex-col overflow-y-scroll w-full h-full my-2 gap-1">
          {items.map((name, i) => (
            <div
              className="flex items-center text-center px-4 py-2 hover:bg-discord-lighter rounded-lg cursor-pointer"
              key={i.toString()}
              id={i.toString()}
              onClick={handleItemChange}
            >
              <p id={i.toString()}>{name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
