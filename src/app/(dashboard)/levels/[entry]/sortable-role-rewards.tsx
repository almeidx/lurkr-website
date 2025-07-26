"use client";

import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import { useState } from "react";
import { SidebarSection } from "@/components/leaderboard/SidebarSection.tsx";
import { type RoleReward, RoleRewardDisplay } from "./03-role-reward.tsx";

interface SortableRoleRewardsProps {
	roleRewards: RoleReward[];
}

export function SortableRoleRewards({ roleRewards }: SortableRoleRewardsProps) {
	const [sortAscending, setSortAscending] = useState(true);

	if (roleRewards.length === 0) {
		return null;
	}

	const sortedRoleRewards = [...roleRewards].sort((a, b) => {
		return sortAscending ? a.level - b.level : b.level - a.level;
	});

	const toggleSort = () => {
		setSortAscending(!sortAscending);
	};

	return (
		<SidebarSection title="Role Rewards">
			<div className="mb-2 flex items-center justify-between">
				<span className="text-gray-400 text-sm">Sorted by level</span>
				<button
					aria-label={`Sort ${sortAscending ? "descending" : "ascending"}`}
					className="flex items-center gap-1 text-gray-400 text-sm transition-colors hover:text-white"
					onClick={toggleSort}
					type="button"
				>
					{sortAscending ? <RiArrowUpSLine className="size-4" /> : <RiArrowDownSLine className="size-4" />}
					{sortAscending ? "Asc" : "Desc"}
				</button>
			</div>
			<div className="flex flex-col gap-4">
				{sortedRoleRewards.map((roleReward) => (
					<RoleRewardDisplay key={roleReward.id} {...roleReward} />
				))}
			</div>
		</SidebarSection>
	);
}
