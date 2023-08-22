import { useCallback, useState } from "react";

export default function Toggle({ id, initialValue, disabled, size, onChange }: ToggleProps) {
	const [checked, setChecked] = useState<boolean>(initialValue);

	const handleClick = useCallback(() => {
		if (disabled) {
			return;
		}

		setChecked(!checked);
		onChange(!checked);
	}, [checked, onChange, disabled]);

	return (
		<label className="relative mr-5 inline-flex cursor-pointer items-center">
			<input checked={checked} className="peer sr-only" onChange={handleClick} type="checkbox" />
			<div className="peer h-6 w-11 rounded-full border-red-800 bg-discord-red after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-discord-green peer-checked:after:translate-x-full peer-checked:after:border-white" />
		</label>
	);
}

interface ToggleProps {
	readonly disabled?: boolean;
	readonly id: string;
	readonly initialValue: boolean;
	onChange(value: boolean): unknown;
	readonly size: "large" | "small";
}
