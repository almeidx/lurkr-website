import { Radio, RadioGroup } from "@/components/dashboard/Radio.tsx";
import { XpChannelMode } from "@/lib/guild.ts";
import { RadioProvider } from "@ariakit/react";

export function LevelingChannelMode({ defaultValue }: { readonly defaultValue?: XpChannelMode }) {
	return (
		<RadioProvider defaultValue={defaultValue}>
			<RadioGroup className="flex w-fit flex-col gap-4">
				<label className="flex text-lg text-white/75 tracking-tight md:text-xl" htmlFor="xpChannelModeWhitelist">
					<Radio value={XpChannelMode.Whitelist} id="xpChannelModeWhitelist" name="xpChannelMode" rightMargin />
					Allow leveling only in these channels…
				</label>

				<label className="flex text-lg text-white/75 tracking-tight md:text-xl" htmlFor="xpChannelModeBlacklist">
					<Radio value={XpChannelMode.Blacklist} id="xpChannelModeBlacklist" name="xpChannelMode" rightMargin />
					Allow leveling in all channels except…
				</label>
			</RadioGroup>
		</RadioProvider>
	);
}
