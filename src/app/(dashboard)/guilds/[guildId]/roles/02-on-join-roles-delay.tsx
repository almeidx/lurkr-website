import { Slider } from "@/components/dashboard/Slider.tsx";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";

export function OnJoinRolesDelay({ defaultValue, premium }: OnJoinRolesDelayProps) {
	const defaultValueInMinutes = defaultValue ? defaultValue / 1_000 / 60 : 0;

	return (
		<Slider
			defaultValue={defaultValueInMinutes}
			id="autoRoleTimeout"
			max={getMaximumLimit("autoRoleTimeout", premium)}
			min={0}
			mobileStepsToHide={[1, 2, 4, 5]}
			step={1}
			steps={["0m", "5m", "10m", "15m", "20m", "25m", "30m"]}
		/>
	);
}

interface OnJoinRolesDelayProps {
	readonly defaultValue: number | null;
	readonly premium: boolean;
}
