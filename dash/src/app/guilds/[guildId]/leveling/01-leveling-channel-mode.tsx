import { RadioProvider } from "@ariakit/react";
import { Radio, RadioGroup } from "@/components/dashboard/Radio.tsx";
import { XpChannelMode } from "@/lib/guild.ts";

export function LevelingChannelMode({ defaultValue }: { readonly defaultValue: XpChannelMode }) {
	return (
		<RadioProvider
			defaultValue={defaultValue} // Force remount when defaultValue changes
			key={defaultValue}
		>
			<RadioGroup className="flex w-fit flex-col gap-4">
				<label className="flex text-lg text-white/75 tracking-tight md:text-xl" htmlFor="xpChannelModeWhitelist">
					<Radio id="xpChannelModeWhitelist" name="xpChannelMode" rightMargin value={XpChannelMode.Whitelist} />
					Allow leveling only in these channels…
				</label>

				<label className="flex text-lg text-white/75 tracking-tight md:text-xl" htmlFor="xpChannelModeBlacklist">
					<Radio id="xpChannelModeBlacklist" name="xpChannelMode" rightMargin value={XpChannelMode.Blacklist} />
					Allow leveling in all channels except…
				</label>
			</RadioGroup>
		</RadioProvider>
	);
}
