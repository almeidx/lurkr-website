import { useCallback, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

interface CheckboxProps {
  initialValue: boolean;
  id: string;
  onChange: (value: boolean) => unknown;
}

export default function Checkbox({ id, initialValue, onChange }: CheckboxProps) {
  const [checked, setChecked] = useState<boolean>(initialValue);

  const handleClick = useCallback(() => {
    setChecked(!checked);
    onChange(!checked);
  }, [checked, onChange]);

  return (
    <div
      className={`${
        checked ? 'bg-[#3ba55d]' : 'bg-[#ed4245]'
      } flex items-center justify-center bg-discord-not-quite-black content-none w-6 h-6 rounded-md cursor-pointer shadow-md`}
      id={id}
      onClick={handleClick}
    >
      {checked ? <FaCheck className="text-white fill-current" onClick={handleClick} /> : null}
    </div>
  );
}
