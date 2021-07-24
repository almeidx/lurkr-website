import type { ChangeEventHandler } from 'react';

interface InputProps {
  className?: string;
  id: string;
  maxLength: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
  placeholder: string;
  value: string;
}

export default function Input(props: InputProps): JSX.Element {
  return (
    <div className={`relative flex justify-center items-center w-1/4 min-w-max h-12 ${props.className ?? ''}`}>
      <input
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="text-white bg-discord-not-quite-black px-5 py-3 focus:outline-none rounded-md shadow w-full"
        id={props.id}
        maxLength={props.maxLength}
        onChange={props.onChange}
        placeholder={props.placeholder}
        type="text"
        value={props.value}
      />

      {props.value && (
        <label
          className="absolute right-0 min-w-max my-auto mx-4 text-2xl text-discord-red active:text-red-600 transition-colors h-full cursor-pointer"
          onClick={props.onClear}
        >
          <span className="inline-block align-middle h-10 leading-10">x</span>
        </label>
      )}
    </div>
  );
}
