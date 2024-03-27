"use client";

import { Radio, RadioGroup, useRadioStore } from "@/components/dashboard/Radio.tsx";
import { XpChannelMode } from "@/lib/guild.ts";

export function LevelingChannelMode({ defaultValue }: { readonly defaultValue?: XpChannelMode }) {
	const radio = useRadioStore({ defaultValue });

	return (
		<RadioGroup className="flex w-fit flex-col gap-4" store={radio}>
			<label className="flex text-lg tracking-tight text-white/75 md:text-xl">
				<Radio value={XpChannelMode.Whitelist} id="xpChannelMode" name="xpChannelMode" rightMargin />
				Allow leveling only in these channels…
			</label>

			<label className="flex text-lg tracking-tight text-white/75 md:text-xl">
				<Radio value={XpChannelMode.Blacklist} id="xpChannelMode" name="xpChannelMode" rightMargin />
				Allow leveling in all channels except…
			</label>
		</RadioGroup>
	);
}
