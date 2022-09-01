import { useCallback, useState } from "react";

interface ToggleProps {
	disabled?: boolean;
	id: string;
	initialValue: boolean;
	onChange(value: boolean): unknown;
	size: "large" | "small";
}

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
		<label className={`switch ${size === "small" ? "small h-6 w-12" : ""}`} id={id}>
			<input checked={checked} onChange={handleClick} type="checkbox" />
			<span className={`slider ${size === "small" ? "before:h-4 before:w-4" : ""}`} />
		</label>
	);
}
