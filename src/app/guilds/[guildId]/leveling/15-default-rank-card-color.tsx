"use client";

import { ColorPicker } from "@/components/dashboard/ColorPicker.tsx";
import { Radio, RadioGroup, useRadioStore } from "@/components/dashboard/Radio.tsx";
import { GuildAccentType } from "@/lib/guild.ts";
import { BRAND_COLOR } from "@/utils/constants.ts";
import { Popover, PopoverDisclosure, usePopoverStore } from "@ariakit/react/popover";
import { IoBan } from "@react-icons/all-files/io5/IoBan";
import { MdFlag } from "@react-icons/all-files/md/MdFlag";
import { MdPalette } from "@react-icons/all-files/md/MdPalette";
import { RiServerLine } from "@react-icons/all-files/ri/RiServerLine";
import { TbColorPicker } from "@react-icons/all-files/tb/TbColorPicker";
import { useEffect, useState } from "react";
import { HexColorInput } from "react-colorful";

export function DefaultRankCardColor({ defaultAccentColour, defaultAccentType }: DefaultRankCardColorProps) {
	const [color, setColor] = useState(defaultAccentColour ?? BRAND_COLOR);

	const radio = useRadioStore({ defaultValue: defaultAccentType ?? "" });
	const value = radio.useState("value");
	const popover = usePopoverStore();

	useEffect(() => {
		if (value !== GuildAccentType.Custom) {
			setColor(BRAND_COLOR);
		}
	}, [value]);

	return (
		<RadioGroup className="flex w-fit flex-col gap-4" store={radio}>
			<label className="flex items-center justify-between">
				<div className="flex items-center text-lg tracking-tight text-white/75 md:text-xl">
					<IoBan className="mr-2 fill-icon-gradient-tertiary" />
					None
				</div>
				<Radio value="" id="accentType" name="accentType" />
			</label>

			<label className="flex items-center justify-between">
				<div className="flex items-center text-lg tracking-tight text-white/75 md:text-xl">
					<RiServerLine className="mr-2 fill-icon-gradient-tertiary" />
					Average Server-icon Colour
				</div>
				<Radio value={GuildAccentType.IconAverage} id="accentType" name="accentType" />
			</label>

			<label className="flex items-center justify-between">
				<div className="flex items-center text-lg tracking-tight text-white/75 md:text-xl">
					<MdFlag className="mr-2 fill-icon-gradient-tertiary" />
					Average Server-banner Colour
				</div>
				<Radio value={GuildAccentType.BannerAverage} id="accentType" name="accentType" />
			</label>

			<div className="flex flex-col gap-2">
				<label className="flex items-center justify-between">
					<div className="flex items-center text-lg tracking-tight text-white/75 md:text-xl">
						<MdPalette className="mr-2 fill-icon-gradient-tertiary" />
						Custom Colour
					</div>
					<Radio value={GuildAccentType.Custom} id="accentType" name="accentType" />
				</label>

				<div className="flex items-center gap-2">
					<PopoverDisclosure
						className="h-10 rounded-lg bg-light-gray px-3 py-2 disabled:opacity-50"
						store={popover}
						disabled={value !== GuildAccentType.Custom}
					>
						<TbColorPicker />
					</PopoverDisclosure>

					<HexColorInput
						className="w-52 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner disabled:opacity-50 md:w-64"
						color={color}
						prefixed
						onChange={setColor}
						id="accentColour"
						name="accentColour"
						disabled={value !== GuildAccentType.Custom}
					/>

					<div aria-hidden="true" className="size-7 rounded-lg" style={{ backgroundColor: color }} />
				</div>

				<Popover store={popover} className="mb-4">
					<ColorPicker onChange={setColor} value={color} />
				</Popover>
			</div>
		</RadioGroup>
	);
}

interface DefaultRankCardColorProps {
	readonly defaultAccentColour: string | null;
	readonly defaultAccentType: GuildAccentType | null;
}
