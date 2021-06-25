import type { ChangeEventHandler, Ref } from 'react';
import { IoMdSend } from 'react-icons/io';

interface InputProps {
  className?: string;
  id: string;
  maxLength: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
  placeholder: string;
  value: string;
}

interface InputWithSubmitProps extends InputProps {
  onSubmit: () => void;
  submitRef: Ref<HTMLButtonElement>;
}

export default function Input(props: InputProps | InputWithSubmitProps): JSX.Element {
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

      {'onSubmit' in props && (
        <button
          className="h-12 w-12 bg-discord-not-quite-black rounded-md flex justify-center items-center ml-3 text-white duration-150 transition-colors"
          onClick={props.onSubmit}
          ref={props.submitRef}
        >
          <IoMdSend className="fill-current text-3xl" />
        </button>
      )}
    </div>
  );
}
