import { useState } from "react";

interface TextareaProps {
	disabled?: boolean;
	id: string;
	initialText: string;
	maxLength: number;
	onChange(text: string): unknown;
	placeholder: string;
}

export default function Textarea({ id, initialText, maxLength, placeholder, disabled, onChange }: TextareaProps) {
	const [text, setText] = useState(initialText);

	return (
		<textarea
			className="w-full rounded-md bg-discord-not-quite-black py-1.5 px-2 text-white shadow focus:outline-none disabled:select-none"
			disabled={disabled}
			id={id}
			onChange={({ target }) => {
				if (target.value.length > maxLength) {
					return;
				}

				setText(target.value);
				onChange(target.value);
			}}
			placeholder={placeholder}
			rows={text.split("\n").length + 2}
			value={text}
			wrap="soft"
		/>
	);
}
