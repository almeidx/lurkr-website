"use client";

import { Slider } from "@/components/dashboard/Slider.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { type XpMultiplier, XpMultiplierType } from "@/lib/guild.ts";
import { useMemo } from "react";

export function GlobalMultipliers({ multipliers }: { readonly multipliers: XpMultiplier[] }) {
	const defaultValue = useMemo(
		() => multipliers.find((multiplier) => multiplier.type === XpMultiplierType.Global),
		[multipliers],
	);

	const id = useMemo(() => defaultValue?.id ?? crypto.randomUUID(), [defaultValue]);

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
				min={0.01}
				max={5}
				step={0.01}
				defaultValue={defaultValue?.multiplier ?? 1}
				steps={[0, 1, 2, 3, 4, 5]}
			/>
		</>
	);
}
