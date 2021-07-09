import { useState } from 'react';

import Toggle from '../form/Toggle';

interface HeaderProps {
  description: string;
  title: string;
}

interface HeaderWithToggleProps extends HeaderProps {
  id: string;
  initialValue: boolean;
  onChange: (value: boolean) => unknown;
}

export default function Header(props: HeaderProps | HeaderWithToggleProps) {
  const [enabled, setEnabled] = useState<boolean>('initialValue' in props && props.initialValue);

  return (
    <>
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

      <p className="text-gray-400 font-light mt-3 mb-3 mx-4">{props.description}</p>
    </>
  );
}
