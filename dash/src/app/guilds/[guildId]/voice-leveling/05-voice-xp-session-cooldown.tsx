"use client";

import { Slider } from "@/components/dashboard/Slider.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { formatMinutes, parseMinutes } from "@/utils/minute-slider-text.ts";

const FREE_STEPS = ["0", "5m", "10m", "15m", "20m", "25m", "30m"];
const PREMIUM_STEPS = ["0", "30m", "1h", "1.5h", "2h"];

export function VoiceXpSessionCooldown({ defaultValue, premium }: VoiceXpSessionCooldownProps) {
	const max = getMaximumLimit("voiceXpMaxSessionCooldown", premium);
	const defaultValueInMinutes = defaultValue ? Math.round(defaultValue / 1_000 / 60) : 0;

	return (
		<>
			<Text>Make members wait between voice sessions before they can earn XP again…</Text>

			<Slider
				defaultValue={defaultValueInMinutes}
				id="voiceXpMaxSessionCooldown"
				max={max}
				min={0}
				mobileStepsToHide={[1, 3, 5]}
				step={1}
				steps={premium ? PREMIUM_STEPS : FREE_STEPS}
				text={{ format: formatMinutes, parse: parseMinutes }}
			/>

			<div className="text-sm text-white/60">
				<p>Set to 0 for no cooldown.</p>

				{defaultValueInMinutes > max ? (
					<p>
						The stored value ({formatMinutes(defaultValueInMinutes)}) was set with Premium and exceeds the current
						limit. Saving will lower it to {formatMinutes(max)}.
					</p>
				) : null}
			</div>
		</>
	);
}

interface VoiceXpSessionCooldownProps {
	readonly defaultValue: number | null;
	readonly premium: boolean;
}
