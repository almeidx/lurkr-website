"use client";

import { useState } from "react";
import { TbArrowsDownUp } from "react-icons/tb";
import type { GetLevelsResult } from "./page";
import Multiplier from "~/components/leaderboard/Multiplier";
import Role from "~/components/leaderboard/Role";
import { XpMultiplierType } from "~/contexts/GuildContext";

export function LeaderboardSidebar({
	guild,
	roleRewards,
	multipliers,
	channels,
}: Pick<GetLevelsResult, "channels" | "guild" | "multipliers" | "roleRewards">) {
	const [multiplierSortDir, setMultiplierSortDir] = useState<-1 | 1>(1);
	const [roleRewardsSortDir, setRoleRewardsSortDir] = useState<-1 | 1>(1);

	return (
		<>
			{(roleRewards || Boolean(multipliers.length)) && (
				<div className="mb-8 flex flex-col items-center gap-4 sm:ml-6">
					{roleRewards && (
						<div className="flex h-fit min-w-[15rem] max-w-[23rem] flex-col items-center divide-y-2 divide-solid divide-gray-400 rounded-2xl bg-discord-not-quite-black pb-4">
							<span className="mx-1 flex flex-row items-center gap-2 whitespace-nowrap py-3 text-center text-2xl font-medium text-white">
								Role Rewards
								<TbArrowsDownUp
									className="cursor-pointer rounded-lg bg-discord-slightly-darker p-1"
									onClick={() => setRoleRewardsSortDir((dir) => (dir === 1 ? -1 : 1))}
								/>
							</span>

							<div className="flex w-full max-w-lg flex-col rounded-lg">
								{roleRewards
									.sort((a, b) => (a.level - b.level) * roleRewardsSortDir)
									.map(({ level, roles }) => (
										<Role key={level} level={level} roles={roles} />
									))}
							</div>
						</div>
					)}

					{Boolean(multipliers.length) && (
						<div className="flex h-fit min-w-[15rem] max-w-[23rem] flex-col items-center divide-y-2 divide-solid divide-gray-400 rounded-2xl bg-discord-not-quite-black pb-4">
							<span className="mx-1 flex flex-row items-center gap-2 whitespace-nowrap py-3 text-center text-2xl font-medium text-white">
								Multipliers
								<TbArrowsDownUp
									className="cursor-pointer rounded-lg bg-discord-slightly-darker p-1"
									onClick={() => setMultiplierSortDir((dir) => (dir === 1 ? -1 : 1))}
								/>
							</span>

							<div className="flex w-full max-w-lg flex-col rounded-lg">
								{multipliers
									.sort((a, b) => (a.multiplier - b.multiplier) * multiplierSortDir)
									.map(({ id, multiplier, targets, type }) => (
										<Multiplier
											items={
												type === XpMultiplierType.Role
													? guild.roles
													: type === XpMultiplierType.Channel
													? channels
													: null
											}
											key={id}
											multiplier={multiplier}
											targets={targets}
											type={type}
										/>
									))}
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
}
