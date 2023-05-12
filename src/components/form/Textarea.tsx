"use client";

import { useState } from "react";

export default function Textarea({ id, initialText, maxLength, placeholder, disabled, onChange }: TextareaProps) {
	const [text, setText] = useState(initialText);

	return (
		<textarea
			className="bg-discord-not-quite-black w-full rounded-md px-2 py-1.5 text-white shadow focus:outline-none disabled:select-none"
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

interface TextareaProps {
	disabled?: boolean;
	id: string;
	initialText: string;
	maxLength: number;
	onChange(text: string): unknown;
	placeholder: string;
}
