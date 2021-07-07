import { useState } from 'react';

interface TextareaProps {
  id: string;
  initialText: string;
  maxLength: number;
  placeholder: string;
  disabled?: boolean;
  onChange: (text: string) => unknown;
}

export default function Textarea({ id, initialText, maxLength, placeholder, disabled, onChange }: TextareaProps) {
  const [text, setText] = useState(initialText);

  return (
    <textarea
      className="bg-discord-not-quite-black focus:outline-none disabled:text-opacity-25 disabled:select-none text-white px-2 py-1.5 rounded-md shadow w-full"
      id={id}
      placeholder={placeholder}
      onChange={({ target }) => {
        if (target.value.length > maxLength) return;
        setText(target.value);
        onChange(target.value);
      }}
      rows={text.split('\n').length + 2}
      value={text}
      wrap="soft"
      disabled={disabled}
    />
  );
}
