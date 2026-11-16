import { Input } from "@/components/dashboard/Input.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import {
	MAX_MILESTONES_INTERVAL,
	MILESTONES_INTERVAL_MULTIPLE_OF,
	MIN_MILESTONES_INTERVAL,
} from "@/lib/guild-config.ts";

export function MilestoneInterval({ defaultValue }: { readonly defaultValue: number }) {
	return (
		<>
			<Text
				docsPath="/guides/automatically-controlled-member-milestones#setting-the-milestones-interval"
				tooltip={`Choose how many members need to join before the next milestone is triggered. This needs to be a multiple of ${MILESTONES_INTERVAL_MULTIPLE_OF}.`}
			>
				Set the interval at which milestones will be announced…
			</Text>

			<Input
				defaultValue={defaultValue}
				id="milestonesInterval"
				max={MAX_MILESTONES_INTERVAL}
				min={MIN_MILESTONES_INTERVAL}
				placeholder={`Enter a number that is a multiple of ${MILESTONES_INTERVAL_MULTIPLE_OF}…`}
				required
				step={MILESTONES_INTERVAL_MULTIPLE_OF}
				type="number"
			/>
		</>
	);
}
