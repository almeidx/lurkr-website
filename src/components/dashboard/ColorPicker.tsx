"use client";

import { HexColorPicker } from "react-colorful";

export function ColorPicker({ onChange, value }: ColorPickerProps) {
	return <HexColorPicker color={value} onChange={onChange} />;
}

interface ColorPickerProps {
	onChange(value: string): void;
	readonly value: string;
}
