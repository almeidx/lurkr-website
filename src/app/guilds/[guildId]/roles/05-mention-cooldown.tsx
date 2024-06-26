import { Slider } from "@/components/dashboard/Slider.tsx";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";

export function MentionCooldown({ defaultValue, premium }: MentionCooldownProps) {
	const defaultValueInMinutes = defaultValue ? defaultValue / 1_000 / 60 : 0;

	return (
		<Slider
			id="mentionCooldown"
			min={0}
			max={getMaximumLimit("mentionCooldown", premium)}
			step={0.5}
			defaultValue={defaultValueInMinutes}
			steps={["0m", "5m", "10m", "15m", "20m", "25m", "30m"]}
		/>
	);
}

interface MentionCooldownProps {
	readonly defaultValue: number | null;
	readonly premium: boolean;
}
