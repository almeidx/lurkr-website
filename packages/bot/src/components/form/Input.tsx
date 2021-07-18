import { Ref, useState } from 'react';
import type { IconType } from 'react-icons';
import { IoMdSend } from 'react-icons/io';
import { MdClear } from 'react-icons/md';

interface InputProps {
  className?: string;
  id: string;
  initialValue: string;
  maxLength: number;
  placeholder: string;
  noClearButton?: boolean;
  disabled?: boolean;
  prefix?: string;
  onChange: (text: string) => unknown;
}

interface InputWithSubmitProps extends InputProps {
  submitIcon?: IconType;
  onSubmit: () => unknown;
  submitRef: Ref<HTMLButtonElement>;
}

export default function Input(props: InputProps | InputWithSubmitProps): JSX.Element {
  const [value, setValue] = useState<string>(props.initialValue);
  const Icon = 'submitIcon' in props ? props.submitIcon! : IoMdSend;

  return (
    <div className={`flex w-full ${props.className ?? ''}`}>
      <div className="relative flex-grow-1 w-full">
        <input
          className={`text-white bg-discord-not-quite-black ${
            props.prefix ? 'pl-[30px]' : 'pl-5'
          } pr-5 py-3 placeholder:text-opacity-75 disabled:text-opacity-25 disabled:select-none focus:outline-none rounded-md shadow w-full`}
          disabled={props.disabled}
          id={props.id}
          maxLength={props.maxLength}
          onChange={({ target }) => {
            if (target.value.length > props.maxLength) return;
            setValue(target.value);
            props.onChange(target.value);
          }}
          placeholder={props.placeholder}
          value={value}
        />

        {props.prefix && (
          <label className={`absolute left-0 py-3 pl-[20px] text-white${value.length > 0 ? '' : ' text-opacity-50'}`}>
            {props.prefix}
          </label>
        )}
        {value && !props.noClearButton && (
          <label
            className="absolute right-0 my-auto mx-4 py-3 text-2xl text-discord-red active:text-red-600 transition-colors h-full cursor-pointer"
            onClick={() => {
              setValue('');
              props.onChange('');
            }}
          >
            <MdClear />
          </label>
        )}
      </div>

      {'onSubmit' in props && (
        <button
          className="flex-shrink-0 h-12 w-12 bg-discord-not-quite-black rounded-md flex justify-center items-center ml-3 text-white disabled:text-opacity-25 disabled:select-none duration-150 transition-colors"
          onClick={props.onSubmit}
          ref={props.submitRef}
          disabled={props.disabled}
        >
          <Icon className="fill-current text-3xl" />
        </button>
      )}
    </div>
  );
}
