import { Slider } from "@/components/dashboard/Slider.tsx";
import { MAX_AUTO_ROLE_TIMEOUT } from "@/lib/guild-config.ts";

export function OnJoinRolesDelay({ defaultValue }: { readonly defaultValue: number | null }) {
	const defaultValueInMinutes = defaultValue ? defaultValue / 1_000 / 60 : 0;

	return (
		<Slider
			defaultValue={defaultValueInMinutes}
			id="autoRoleTimeout"
			max={MAX_AUTO_ROLE_TIMEOUT}
			min={0}
			mobileStepsToHide={[1, 2, 4, 5]}
			step={1}
			steps={["0m", "5m", "10m", "15m", "20m", "25m", "30m"]}
		/>
	);
}
