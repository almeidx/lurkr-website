import { useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';

import Toggle from '../form/Toggle';

interface HeaderProps {
  description: string;
  title: string;
  openMenu: () => void;
}

interface HeaderWithToggleProps extends HeaderProps {
  id: string;
  initialValue: boolean;
  onChange: (value: boolean) => unknown;
  openMenu: () => void;
}

export default function Header(props: HeaderProps | HeaderWithToggleProps) {
  const [enabled, setEnabled] = useState<boolean>('initialValue' in props && props.initialValue);

  return (
    <>
      <BiArrowBack
        onClick={props.openMenu}
        className="inline-block z-[99999] mb-4 ml-4 w-6 h-6 text-white cursor-pointer sm:hidden"
      />
      <div className="flex justify-between mx-4">
        <h1 className="text-white">{props.title}</h1>

        {'initialValue' in props && (
          <div className="flex flex-row gap-x-3 items-center">
            <label className="text-white" htmlFor={props.id}>
              {enabled ? 'Enabled' : 'Disabled'}
            </label>
            <Toggle
              id={props.id}
              initialValue={props.initialValue}
              size="small"
              onChange={(v) => {
                setEnabled(v);
                props.onChange(v);
              }}
            />
          </div>
        )}
      </div>

      <p className="my-3 mx-4 font-light text-gray-400">{props.description}</p>
    </>
  );
}
