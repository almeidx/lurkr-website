import type { ChangeEventHandler, Ref } from 'react';
import { IoMdSend } from 'react-icons/io';
import { MdClear } from 'react-icons/md';

interface InputProps {
  className?: string;
  id: string;
  maxLength: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => unknown;
  placeholder: string;
  value: string;
}

interface InputWithSubmitProps extends InputProps {
  onSubmit: () => unknown;
  submitRef: Ref<HTMLButtonElement>;
}

export default function Input(props: InputProps | InputWithSubmitProps): JSX.Element {
  return (
    <div className={`flex w-full ${props.className ?? ''}`}>
      <div className="relative flex-grow-1 w-full">
        <input
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="text-white bg-discord-not-quite-black pl-5 pr-5 py-3 focus:outline-none rounded-md shadow w-full"
          id={props.id}
          maxLength={props.maxLength}
          onChange={props.onChange}
          placeholder={props.placeholder}
          type="text"
          value={props.value}
        />

        {props.value && (
          <label
            className="absolute right-0 my-auto mx-4 py-3 text-2xl text-discord-red active:text-red-600 transition-colors h-full cursor-pointer"
            onClick={props.onClear}
          >
            <MdClear />
          </label>
        )}
      </div>
      {'onSubmit' in props && (
        <button
          className="flex-shrink-0 h-12 w-12 bg-discord-not-quite-black rounded-md flex justify-center items-center ml-3 text-white duration-150 transition-colors"
          onClick={props.onSubmit}
          ref={props.submitRef}
        >
          <IoMdSend className="fill-current text-3xl" />
        </button>
      )}
    </div>
  );
}
