"use client";

import { useMemo, useState } from "react";
import { TbArrowsDownUp } from "react-icons/tb";
import Multiplier from "@/leaderboard/Multiplier";
import Role from "@/leaderboard/Role";
import type { IMultiplier, RoleReward } from "~/contexts/GuildContext";

export function LeaderboardSidebar({
	multipliers,
	roleRewards,
}: {
	multipliers: IMultiplier[];
	roleRewards: RoleReward[];
}) {
	const [multiplierSortDir, setMultiplierSortDir] = useState<-1 | 1>(1);
	const [roleRewardsSortDir, setRoleRewardsSortDir] = useState<-1 | 1>(1);

	const sortedRoleRewards = useMemo(
		() => roleRewards.sort((a, b) => (a.level - b.level) * roleRewardsSortDir),
		[roleRewards, roleRewardsSortDir],
	);

	const sortedMultipliers = useMemo(
		() => multipliers.sort((a, b) => (a.multiplier - b.multiplier) * multiplierSortDir),
		[multipliers, multiplierSortDir],
	);

	return sortedRoleRewards?.length || sortedMultipliers?.length ? (
		<div className="mb-8 flex flex-col items-center gap-6 md:ml-6">
			{sortedRoleRewards?.length ? (
				<div className="bg-discord-not-quite-black flex h-fit w-full flex-col items-center divide-y-2 divide-solid divide-gray-400 rounded-2xl pb-4 md:w-72">
					<span className="mx-1 flex flex-row items-center gap-2 whitespace-nowrap py-3 text-center text-2xl font-medium text-white">
						Role Rewards
						<TbArrowsDownUp
							className="bg-discord-slightly-darker cursor-pointer rounded-lg p-1"
							onClick={() => setRoleRewardsSortDir((dir) => (dir === 1 ? -1 : 1))}
						/>
					</span>

					<div className="flex w-full max-w-lg flex-col rounded-lg">
						{sortedRoleRewards.map(({ level, roles }) => (
							<Role key={level} level={level} roles={roles} />
						))}
					</div>
				</div>
			) : null}

			{sortedMultipliers?.length ? (
				<div className="bg-discord-not-quite-black flex h-fit w-full flex-col items-center divide-y-2 divide-solid divide-gray-400 rounded-2xl pb-4 md:w-72">
					<span className="mx-1 flex flex-row items-center gap-2 whitespace-nowrap py-3 text-center text-2xl font-medium text-white">
						Multipliers
						<TbArrowsDownUp
							className="bg-discord-slightly-darker cursor-pointer rounded-lg p-1"
							onClick={() => setMultiplierSortDir((dir) => (dir === 1 ? -1 : 1))}
						/>
					</span>

					<div className="flex w-full max-w-lg flex-col rounded-lg">
						{sortedMultipliers.map(({ id, multiplier, targets, type }) => (
							<Multiplier key={id} multiplier={multiplier} targets={targets} type={type} />
						))}
					</div>
				</div>
			) : null}
		</div>
	) : null;
}
