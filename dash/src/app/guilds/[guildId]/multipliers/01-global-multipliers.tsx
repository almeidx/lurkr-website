import { Slider } from "@/components/dashboard/Slider.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { MAX_XP_MULTIPLIER_VALUE, MIN_XP_MULTIPLIER_VALUE } from "@/lib/guild-config.ts";

export function GlobalMultipliers({ defaultValue }: { readonly defaultValue: number }) {
	return (
		<>
			<Text
				docsPath="/guides/setting-up-leveling-multipliers#setting-global-multipliers"
				htmlFor="xpGlobalMultiplier"
				tooltip="Change how fast your members will gain experience. This only changes the amount of experience gained per message, not how often a message will receive experience."
			>
				Set a global multiplier that applies to everyone in the server…
			</Text>

			<Slider
				defaultValue={defaultValue}
				id="xpGlobalMultiplier"
				max={MAX_XP_MULTIPLIER_VALUE}
				min={MIN_XP_MULTIPLIER_VALUE}
				step={MIN_XP_MULTIPLIER_VALUE}
				steps={[0, 1, 2, 3, 4, 5]}
			/>
		</>
	);
}
