import { Slider } from "@/components/dashboard/Slider.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { type XpMultiplier, XpMultiplierType } from "@/lib/guild.ts";
import { MAX_XP_MULTIPLIER_VALUE, MIN_XP_MULTIPLIER_VALUE } from "@/lib/guild-config.ts";

export function GlobalMultipliers({ multipliers }: { readonly multipliers: XpMultiplier[] }) {
	const defaultValue = multipliers.find((multiplier) => multiplier.type === XpMultiplierType.Global);

	const id = defaultValue?.id ?? crypto.randomUUID();

	return (
		<>
			<Text
				docsPath="/guides/setting-up-leveling-multipliers#setting-global-multipliers"
				htmlFor={`xpMultipliers-${XpMultiplierType.Global}-${id}`}
				tooltip="Change how fast your members will gain experience. This only changes the amount of experience gained per message, not how often a message will receive experience."
			>
				Set a global multiplier that applies to everyone in the server…
			</Text>

			<Slider
				defaultValue={defaultValue?.multiplier ?? 1}
				id={`xpMultipliers-${XpMultiplierType.Global}-${id}`}
				max={MAX_XP_MULTIPLIER_VALUE}
				min={MIN_XP_MULTIPLIER_VALUE}
				step={MIN_XP_MULTIPLIER_VALUE}
				steps={[0, 1, 2, 3, 4, 5]}
			/>
		</>
	);
}
