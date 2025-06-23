"use client";

import { useEffect, useState } from "react";
import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { AddComment } from "@/components/icons/mdi/add-comment.tsx";
import { Delete } from "@/components/icons/mdi/delete.tsx";
import { Toggle } from "@/components/Toggle.tsx";
import type { Role, XpRoleReward } from "@/lib/guild.ts";
import {
	MAX_XP_ROLE_REWARD_LEVEL,
	MAX_XP_ROLE_REWARD_ROLES,
	MAX_XP_ROLE_REWARD_ROLES_PREMIUM,
	MAX_XP_ROLE_REWARDS,
	MAX_XP_ROLE_REWARDS_PREMIUM,
	MIN_XP_ROLE_REWARD_LEVEL,
} from "@/lib/guild-config.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

export function LevelingRoleRewards({ defaultRoleRewards, premium, roles }: LevelingRoleRewardsProps) {
	const [roleRewards, setRoleRewards] = useState<XpRoleReward[]>(defaultRoleRewards);
	const [newRoles, setNewRoles] = useState<readonly Role[]>([]);
	const [newLevel, setNewLevel] = useState("");

	const maxRoleRewards = getMaximumLimit("xpRoleRewards", premium);
	const maxRoleRewardRoles = getMaximumLimit("xpRoleRewardRoles", premium);

	const isDuplicate = roleRewards.some((roleReward) => roleReward.level === Number.parseInt(newLevel, 10));

	useEffect(() => {
		setRoleRewards(defaultRoleRewards);
	}, [defaultRoleRewards]);

	function handleCreateRoleReward() {
		const level = Number.parseInt(newLevel, 10);
		const roleIds = newRoles.map(({ id }) => id);

		if (
			isDuplicate ||
			Number.isNaN(level) ||
			level < MIN_XP_ROLE_REWARD_LEVEL ||
			level > MAX_XP_ROLE_REWARD_LEVEL ||
			roleIds.length === 0 ||
			roleIds.length > maxRoleRewardRoles ||
			roleRewards.length > maxRoleRewards
		) {
			return;
		}

		setRoleRewards((prev) =>
			[...prev, { id: crypto.randomUUID(), level, roleIds, stack: true }].sort((a, b) => a.level - b.level),
		);

		setNewRoles([]);
		setNewLevel("");
	}

	function handleDeleteRoleReward(id: string) {
		setRoleRewards((prev) => prev.filter((roleReward) => roleReward.id !== id));
	}

	return (
		<>
			<Label
				htmlFor="newXpRoleRewardLevel"
				sub={`Max. ${MAX_XP_ROLE_REWARD_ROLES} roles per level - Max. ${MAX_XP_ROLE_REWARD_ROLES_PREMIUM} for Premium`}
			>
				Create your role rewards…
			</Label>

			<div className="flex flex-wrap items-center gap-3">
				<p className="text-lg text-white/75 tracking-tight md:text-xl">Select your role: </p>

				<RoleSelector
					defaultValues={[]}
					inputId="role-rewards-sel"
					max={getMaximumLimit("xpRoleRewardRoles", premium)}
					onChange={(newRoles) => setNewRoles(newRoles)}
					roles={roles}
					settingId="newRoles"
				/>

				<p className="text-lg text-white/75 tracking-tight md:text-xl">and the level to reward it at: </p>

				<Input
					id="newLevel"
					max={MAX_XP_ROLE_REWARD_LEVEL}
					min={1}
					onChange={(event) => setNewLevel(event.target.value)}
					placeholder="Enter a level…"
					type="number"
					value={newLevel}
				/>

				<button
					className="rounded-lg bg-green p-1 transition-colors not-disabled:hover:bg-green/75"
					disabled={roleRewards.length >= maxRoleRewards || !newRoles.length || !newLevel || isDuplicate}
					onClick={handleCreateRoleReward}
					type="button"
				>
					<AddComment className="size-6 text-white" />
				</button>
			</div>

			{roleRewards.length ? (
				<>
					<Label sub={`Max. ${MAX_XP_ROLE_REWARDS} rewards total - Max. ${MAX_XP_ROLE_REWARDS_PREMIUM} for Premium`}>
						Manage your role rewards…
					</Label>

					{roleRewards.map((roleReward) => (
						<RoleRewardDisplay
							key={roleReward.id}
							{...roleReward}
							onDelete={handleDeleteRoleReward}
							premium={premium}
							roles={roles}
						/>
					))}
				</>
			) : null}
		</>
	);
}

function RoleRewardDisplay({ id, level, premium, roleIds, onDelete, roles, stack }: RoleRewardDisplayProps) {
	const resolvedRoles = mapRoleIdsToRoles(roleIds, roles);

	return (
		<div className="flex flex-wrap items-center gap-4">
			<button
				className="group relative flex size-9 items-center justify-center rounded-lg border border-white bg-darker text-[#fff]"
				onClick={() => onDelete(id)}
				type="button"
			>
				<div className="absolute hidden size-9 items-center justify-center rounded-lg border border-white bg-darker group-hover:flex">
					<Delete className="size-5 text-[#ed4245]" />
				</div>

				{level}
			</button>

			<div className="flex items-center gap-2 rounded-lg bg-darker p-2">
				<Toggle id={`xpRoleRewards-${level}-${id}-stack`} initialValue={stack} />

				<span className="text-sm text-white/75">Stack</span>

				<DocsBubble
					path="/guides/leveling-automation#stacking-role-rewards"
					tooltip="When disabled, members will lose this role reward if they earn a higher level role reward"
				/>
			</div>

			<RoleSelector
				defaultValues={resolvedRoles}
				inputId={`role-rewards-${id}`}
				max={getMaximumLimit("xpRoleRewardRoles", premium)}
				roles={roles}
				settingId={`xpRoleRewards-${level}-${id}`}
			/>
		</div>
	);
}

type RoleRewardDisplayProps = XpRoleReward & {
	onDelete(id: string): void;
	readonly premium: boolean;
	readonly roles: Role[];
};

interface LevelingRoleRewardsProps {
	readonly defaultRoleRewards: XpRoleReward[];
	readonly premium: boolean;
	readonly roles: Role[];
}
