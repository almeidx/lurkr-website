import { Slider } from "@/components/dashboard/Slider.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { MAX_XP_MULTIPLIER_VALUE, MIN_XP_MULTIPLIER_VALUE } from "@/lib/guild-config.ts";
import { type XpMultiplier, XpMultiplierType } from "@/lib/guild.ts";

export function GlobalMultipliers({ multipliers }: { readonly multipliers: XpMultiplier[] }) {
	const defaultValue = multipliers.find((multiplier) => multiplier.type === XpMultiplierType.Global);

	const id = defaultValue?.id ?? crypto.randomUUID();

	return (
		<>
			<Text
				htmlFor={`xpMultipliers-${XpMultiplierType.Global}-${id}`}
				docsPath="/guides/setting-up-leveling-multipliers#setting-global-multipliers"
				tooltip="Change how fast your members will gain experience. This only changes the amount of experience gained per message, not how often a message will receive experience."
			>
				Set a global multiplier that applies to everyone in the server…
			</Text>

			<Slider
				id={`xpMultipliers-${XpMultiplierType.Global}-${id}`}
				min={MIN_XP_MULTIPLIER_VALUE}
				max={MAX_XP_MULTIPLIER_VALUE}
				step={MIN_XP_MULTIPLIER_VALUE}
				defaultValue={defaultValue?.multiplier ?? 1}
				steps={[0, 1, 2, 3, 4, 5]}
			/>
		</>
	);
}
