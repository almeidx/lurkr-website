import { RadioProvider } from "@ariakit/react";
import { Radio, RadioGroup } from "@/components/dashboard/Radio.tsx";
import { XpChannelMode } from "@/lib/guild.ts";

export function VoiceChannelMode({ defaultValue }: { readonly defaultValue: XpChannelMode }) {
	return (
		<RadioProvider
			defaultValue={defaultValue} // Force remount when defaultValue changes
			key={defaultValue}
		>
			<RadioGroup className="flex w-fit flex-col gap-4">
				<label className="flex text-lg text-white/75 tracking-tight md:text-xl" htmlFor="voiceXpChannelModeWhitelist">
					<Radio
						id="voiceXpChannelModeWhitelist"
						name="voiceXpChannelMode"
						rightMargin
						value={XpChannelMode.Whitelist}
					/>
					Allow voice leveling only in these channels…
				</label>

				<label className="flex text-lg text-white/75 tracking-tight md:text-xl" htmlFor="voiceXpChannelModeBlacklist">
					<Radio
						id="voiceXpChannelModeBlacklist"
						name="voiceXpChannelMode"
						rightMargin
						value={XpChannelMode.Blacklist}
					/>
					Allow voice leveling in all channels except…
				</label>
			</RadioGroup>
		</RadioProvider>
	);
}
