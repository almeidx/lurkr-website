"use client";

import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import {
	MAX_XP_ROLE_REWARDS,
	MAX_XP_ROLE_REWARDS_PREMIUM,
	MAX_XP_ROLE_REWARD_ROLES,
	MAX_XP_ROLE_REWARD_ROLES_PREMIUM,
} from "@/lib/guild-config.ts";
import type { Role, XpRoleReward } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { BiSolidTrash } from "@react-icons/all-files/bi/BiSolidTrash";
import { MdPersonAddAlt1 } from "@react-icons/all-files/md/MdPersonAddAlt1";
import { useMemo, useState } from "react";

export function LevelingRoleRewards({ defaultRoleRewards, premium, roles }: LevelingRoleRewardsProps) {
	const [roleRewards, setRoleRewards] = useState<XpRoleReward[]>(defaultRoleRewards);
	const [newRoles, setNewRoles] = useState<readonly Role[]>([]);
	const [newLevel, setNewLevel] = useState("");

	const maxRoleRewards = getMaximumLimit("xpRoleRewards", premium);

	function handleCreateRoleReward() {
		const level = Number.parseInt(newLevel, 10);
		const roleIds = newRoles.map(({ id }) => id);

		if (Number.isNaN(level) || level < 1 || level > 100 || roleIds.length === 0 || roleIds.length > 25) {
			return;
		}

		setRoleRewards((prev) => [...prev, { id: crypto.randomUUID(), level, roleIds }].sort((a, b) => a.level - b.level));

		setNewRoles([]);
		setNewLevel("");
	}

	function handleDeleteRoleReward(id: string) {
		setRoleRewards((prev) => prev.filter((roleReward) => roleReward.id !== id));
	}

	return (
		<>
			<Label
				sub={`Max. ${MAX_XP_ROLE_REWARD_ROLES} roles per level - Max. ${MAX_XP_ROLE_REWARD_ROLES_PREMIUM} for Premium`}
				htmlFor="newXpRoleRewardLevel"
			>
				Create your role rewards…
			</Label>

			<div className="flex flex-wrap items-center gap-3">
				<p className="text-lg tracking-tight text-white/75 md:text-xl">Select your role: </p>

				<RoleSelector
					defaultValues={[]}
					inputId="role-rewards"
					max={getMaximumLimit("xpRoleRewardRoles", premium)}
					roles={roles}
					settingId="newRoles"
					onChange={(newRoles) => setNewRoles(newRoles)}
				/>

				<p className="text-lg tracking-tight text-white/75 md:text-xl">and the level to reward it at: </p>

				<input
					id="newLevel"
					placeholder="Enter a level…"
					className="max-w-3xl rounded-lg bg-light-gray p-2 px-3 shadow-dim-inner"
					type="number"
					value={newLevel}
					onChange={(event) => setNewLevel(event.target.value)}
				/>

				<button
					className="rounded-lg bg-green p-1 transition-colors [&:not(:disabled)]:hover:bg-green/75 disabled:cursor-not-allowed"
					onClick={handleCreateRoleReward}
					disabled={roleRewards.length >= maxRoleRewards || !newRoles.length || !newLevel}
					type="button"
				>
					<MdPersonAddAlt1 color="white" size={24} />
				</button>
			</div>

			{roleRewards.length ? (
				<>
					<Label sub={`Max. ${MAX_XP_ROLE_REWARDS} roles total - Max. ${MAX_XP_ROLE_REWARDS_PREMIUM} for Premium`}>
						Manage your role rewards…
					</Label>

					{roleRewards.map((roleReward) => (
						<RoleRewardDisplay
							key={roleReward.id}
							{...roleReward}
							roles={roles}
							onDelete={handleDeleteRoleReward}
							premium={premium}
						/>
					))}
				</>
			) : null}
		</>
	);
}

function RoleRewardDisplay({ id, level, premium, roleIds, onDelete, roles }: RoleRewardDisplayProps) {
	const resolvedRoles = useMemo(
		() =>
			roleIds
				.map((roleId) => {
					const role = roles.find((role) => role.id === roleId);
					return role ? { ...role, resolvedColor: decimalRoleColorToHex(role.color) } : null!;
				})
				.filter(Boolean),
		[roleIds, roles],
	);

	return (
		<div className="flex items-center gap-4">
			<button
				className="group relative flex size-9 items-center justify-center rounded-lg border border-white bg-[#1e1f22] text-lg text-[#fff] md:text-xl"
				onClick={() => onDelete(id)}
				type="button"
			>
				<div className="absolute hidden size-9 items-center justify-center rounded-lg border border-white bg-[#1e1f22] group-hover:flex">
					<BiSolidTrash color="#ed4245" size={19} />
				</div>

				{level}
			</button>

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
