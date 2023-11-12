"use client";

import { Radio, RadioGroup, useRadioStore } from "@/components/dashboard/Radio.tsx";
import { XpChannelMode } from "@/lib/guild.ts";

export function LevelingChannelMode({ defaultValue }: { readonly defaultValue?: XpChannelMode }) {
	const radio = useRadioStore({ defaultValue });

	return (
		<RadioGroup className="flex w-fit flex-col gap-4" store={radio}>
			<label className="w-100 flex items-center justify-between text-lg tracking-tight text-white/75 md:text-xl">
				Deny leveling in all channels except…
				<Radio value={XpChannelMode.Whitelist} id="xpChannelMode" name="xpChannelMode" />
			</label>

			<label className="w-100 flex items-center justify-between text-lg tracking-tight text-white/75 md:text-xl">
				Allow leveling in all channels except…
				<Radio value={XpChannelMode.Blacklist} id="xpChannelMode" name="xpChannelMode" />
			</label>
		</RadioGroup>
	);
}
