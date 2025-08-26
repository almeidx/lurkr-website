"use client";

import { Popover, PopoverDisclosure, PopoverProvider } from "@ariakit/react";
import { useState } from "react";
import { HexColorInput } from "react-colorful";
import { ColorPicker } from "@/components/dashboard/ColorPicker.tsx";
import { Colorize } from "@/components/icons/mdi/colorize.tsx";
import { DEFAULT_ACCENT_COLOR } from "@/utils/constants.ts";

export function DefaultRankCardColor({ defaultAccentColour }: DefaultRankCardColorProps) {
	const [color, setColor] = useState(defaultAccentColour ?? DEFAULT_ACCENT_COLOR);

	return (
		<PopoverProvider>
			<div className="flex items-center gap-2">
				<PopoverDisclosure className="h-10 rounded-lg bg-light-gray px-3 py-2">
					<Colorize />
				</PopoverDisclosure>

				<HexColorInput
					className="w-52 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner md:w-64"
					color={color}
					id="accentColour"
					name="accentColour"
					onChange={setColor}
					prefixed
				/>

				<div aria-hidden className="size-7 rounded-lg" style={{ backgroundColor: color }} />
			</div>

			<Popover className="my-4">
				<ColorPicker onChange={setColor} value={color} />
			</Popover>
		</PopoverProvider>
	);
}

interface DefaultRankCardColorProps {
	readonly defaultAccentColour: string | null;
}
