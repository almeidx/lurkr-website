import { type RoleReward, RoleRewardDisplay } from "./03-role-reward.tsx";
import { SortableSection } from "./sortable-section.tsx";

export function SortableRoleRewards({ roleRewards }: SortableRoleRewardsProps) {
	return (
		<SortableSection
			data={roleRewards}
			title="Role Rewards"
			sortBy={(roleReward) => roleReward.level}
			renderItem={(roleReward) => <RoleRewardDisplay {...roleReward} />}
			keyExtractor={(roleReward) => roleReward.id}
		/>
	);
}

interface SortableRoleRewardsProps {
	roleRewards: RoleReward[];
}
