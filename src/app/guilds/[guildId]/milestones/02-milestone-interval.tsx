import { Input } from "@/components/dashboard/Input.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { MILESTONES_INTERVAL_MULTIPLE_OF, MIN_MILESTONES_INTERVAL } from "@/lib/guild-config.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";

export function MilestoneInterval({ defaultValue, premium }: MilestoneIntervalProps) {
	return (
		<>
			<Text docsPath="/guides/automatically-controlled-member-milestones#setting-the-milestones-interval">
				Set the interval at which milestones will be announced…
			</Text>

			<Input
				defaultValue={defaultValue}
				id="milestonesInterval"
				placeholder="Enter a number that is a multiple of 10…"
				type="number"
				required
				min={MIN_MILESTONES_INTERVAL}
				max={getMaximumLimit("milestonesInterval", premium)}
				step={MILESTONES_INTERVAL_MULTIPLE_OF}
			/>
		</>
	);
}

interface MilestoneIntervalProps {
	readonly defaultValue: number;
	readonly premium: boolean;
}
