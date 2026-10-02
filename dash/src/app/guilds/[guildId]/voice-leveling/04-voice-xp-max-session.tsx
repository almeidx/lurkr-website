"use client";

import { Slider } from "@/components/dashboard/Slider.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { formatMinutes, parseMinutes } from "@/utils/minute-slider-text.ts";

const FREE_STEPS = ["0", "6h", "12h", "18h", "24h"];
const PREMIUM_STEPS = ["0", "12h", "24h", "36h", "48h"];

export function VoiceXpMaxSession({ defaultValue, premium }: VoiceXpMaxSessionProps) {
	const max = getMaximumLimit("voiceXpMaxSession", premium);
	const defaultValueInMinutes = defaultValue ? Math.round(defaultValue / 1_000 / 60) : 0;

	return (
		<>
			<Text>Stop awarding voice XP after a member has been in a voice channel for…</Text>

			<Slider
				defaultValue={defaultValueInMinutes}
				id="voiceXpMaxSession"
				max={max}
				min={0}
				mobileStepsToHide={[1, 3]}
				step={60}
				steps={premium ? PREMIUM_STEPS : FREE_STEPS}
				text={{ format: formatMinutes, parse: parseMinutes }}
			/>

			<div className="text-sm text-white/60">
				<p>Set to 0 for no limit. After hitting the limit, the session cooldown below applies.</p>

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

interface VoiceXpMaxSessionProps {
	readonly defaultValue: number | null;
	readonly premium: boolean;
}
