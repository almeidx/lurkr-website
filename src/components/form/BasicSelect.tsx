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
      const index = parseInt((event.target as HTMLDivElement | HTMLParagraphElement).dataset.id ?? 'NaN', 10);
      const item = items[index];

      if (disabled) return;
      if (!item) return console.error("[BasicSelect] Couldn't find the item when user tried changing item");

      onSelect(item);
      setSelected(item);
      if (closeOnSelect) setDropdownOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  );

  return (
    <div ref={elementRef} className={`relative text-white w-full ${disabled ? 'text-opacity-25' : 'cursor-pointer'}`}>
      <div
        className="flex flex-row flex-wrap gap-1.5 py-3 px-5 w-full h-12 bg-discord-not-quite-black rounded-md focus:outline-none shadow"
        onClick={() => (disabled ? null : setDropdownOpen(!dropdownOpen))}
      >
        <span className="flex z-50 items-center py-1 px-1.5 w-full leading-3 ">{selected}</span>

        <div className="absolute right-0 my-auto mx-4 h-full text-2xl transition-colors">
          <AiFillCaretDown />
        </div>
      </div>

      <div
        className={`${
          !dropdownOpen ? 'hidden' : ''
        } absolute z-[100] max-h-64 w-full bg-[#36393f] flex flex-col items-center mt-2 rounded-md`}
      >
        <div className="flex overflow-y-scroll flex-col gap-1 my-2 w-full h-full">
          {items.map((name, i) => (
            <div
              className="flex items-center py-2 px-4 text-center hover:bg-discord-lighter rounded-lg cursor-pointer"
              data-id={i.toString()}
              key={i.toString()}
              onClick={handleItemChange}
            >
              <p data-id={i.toString()}>{name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
