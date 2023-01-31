import { useCallback, useState } from "react";
import { FaCheck } from "react-icons/fa";

export default function Checkbox({ id, initialValue, disabled, onChange }: CheckboxProps) {
	const [checked, setChecked] = useState<boolean>(initialValue);

	const handleClick = useCallback(() => {
		if (disabled) {
			return;
		}

		setChecked(!checked);
		onChange(!checked);
	}, [checked, onChange, disabled]);

	return (
		<div
			className={`${
				disabled ? "bg-discord-not-quite-black" : checked ? "bg-[#3ba55d]" : "bg-[#ed4245]"
			} flex h-6 w-6 cursor-pointer items-center justify-center rounded-md shadow-md content-none`}
			id={id}
			onClick={handleClick}
		>
			{checked ? <FaCheck className="fill-current text-white" onClick={handleClick} /> : null}
		</div>
	);
}

interface CheckboxProps {
	disabled?: boolean;
	id: string;
	initialValue: boolean;
	onChange(value: boolean): unknown;
}
