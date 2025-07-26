import { type RoleReward, RoleRewardDisplay } from "./03-role-reward.tsx";
import { SortableSection } from "./sortable-section.tsx";

export function SortableRoleRewards({ roleRewards }: SortableRoleRewardsProps) {
	return (
		<SortableSection
			data={roleRewards}
			keyExtractor={(roleReward) => roleReward.id}
			renderItem={(roleReward) => <RoleRewardDisplay {...roleReward} />}
			sortBy={(roleReward) => roleReward.level}
			title="Role Rewards"
		/>
	);
}

interface SortableRoleRewardsProps {
	roleRewards: RoleReward[];
}
