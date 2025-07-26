"use client";

import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import { useState } from "react";
import { SidebarSection } from "@/components/leaderboard/SidebarSection.tsx";
import { type RoleReward, RoleRewardDisplay } from "./03-role-reward.tsx";

export function SortableRoleRewards({ roleRewards }: SortableRoleRewardsProps) {
	const [sortAscending, setSortAscending] = useState(true);

	if (roleRewards.length === 0) {
		return null;
	}

	const sortedRoleRewards = [...roleRewards].sort((a, b) => {
		return sortAscending ? a.level - b.level : b.level - a.level;
	});

	function toggleSort() {
		setSortAscending((previousValue) => !previousValue);
	}

	const sortButton = (
		<button
			aria-label={`Sort ${sortAscending ? "descending" : "ascending"}`}
			className="flex items-center gap-1 text-gray-400 text-sm transition-colors hover:text-white"
			onClick={toggleSort}
			type="button"
		>
			{sortAscending ? <RiArrowUpSLine className="size-4" /> : <RiArrowDownSLine className="size-4" />}
			{sortAscending ? "Asc" : "Desc"}
		</button>
	);

	return (
		<SidebarSection title="Role Rewards" titleAction={sortButton}>
			<div className="flex flex-col gap-4">
				{sortedRoleRewards.map((roleReward) => (
					<RoleRewardDisplay key={roleReward.id} {...roleReward} />
				))}
			</div>
		</SidebarSection>
	);
}

interface SortableRoleRewardsProps {
	roleRewards: RoleReward[];
}
