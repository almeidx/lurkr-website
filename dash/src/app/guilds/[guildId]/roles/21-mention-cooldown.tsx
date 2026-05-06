"use client";

import parseDuration from "parse-duration";
import prettyMilliseconds from "pretty-ms";
import { Slider } from "@/components/dashboard/Slider.tsx";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";

const FREE_STEPS = ["0", "1h", "2h", "3h", "4h", "5h", "6h"];
const PREMIUM_STEPS = ["0", "4h", "8h", "12h", "16h", "20h", "24h"];

function formatMinutes(minutes: number): string {
	if (minutes <= 0) return "0m";
	return prettyMilliseconds(minutes * 60_000, { hideYearAndDays: true });
}

function parseMinutes(input: string): number | null {
	const trimmed = input.trim();
	if (!trimmed) return null;
	if (/^\d+$/.test(trimmed)) return Number.parseInt(trimmed, 10);

	const minutes = parseDuration(trimmed, "m");
	return minutes === null ? null : Math.round(minutes);
}

export function MentionCooldown({ defaultValue, premium }: MentionCooldownProps) {
	const defaultValueInMinutes = defaultValue ? defaultValue / 1_000 / 60 : 0;

	return (
		<Slider
			defaultValue={defaultValueInMinutes}
			id="mentionCooldown"
			max={getMaximumLimit("mentionCooldown", premium)}
			min={0}
			mobileStepsToHide={[1, 2, 4, 5]}
			step={1}
			steps={premium ? PREMIUM_STEPS : FREE_STEPS}
			text={{ format: formatMinutes, parse: parseMinutes }}
		/>
	);
}

interface MentionCooldownProps {
	readonly defaultValue: number | null;
	readonly premium: boolean;
}
