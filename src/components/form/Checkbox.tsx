import { useCallback, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

interface CheckboxProps {
  initialValue: boolean;
  id: string;
  disabled?: boolean;
  onChange: (value: boolean) => unknown;
}

export default function Checkbox({ id, initialValue, disabled, onChange }: CheckboxProps) {
  const [checked, setChecked] = useState<boolean>(initialValue);

  const handleClick = useCallback(() => {
    if (disabled) return;
    setChecked(!checked);
    onChange(!checked);
  }, [checked, onChange, disabled]);

  return (
    <div
      className={`${
        disabled ? 'bg-discord-not-quite-black' : checked ? 'bg-[#3ba55d]' : 'bg-[#ed4245]'
      } flex items-center justify-center content-none w-6 h-6 rounded-md cursor-pointer shadow-md`}
      id={id}
      onClick={handleClick}
    >
      {checked ? <FaCheck className="text-white fill-current" onClick={handleClick} /> : null}
    </div>
  );
}
