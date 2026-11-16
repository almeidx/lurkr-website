"use client";

import { useState } from "react";
import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { AddComment } from "@/components/icons/mdi/add-comment.tsx";
import { Delete } from "@/components/icons/mdi/delete.tsx";
import { Toggle } from "@/components/Toggle.tsx";
import { limitFor, limitLabel, MAX_XP_ROLE_REWARD_LEVEL, MIN_XP_ROLE_REWARD_LEVEL } from "@/lib/guild-config.ts";
import type { Role, XpRoleReward } from "@/lib/guild.ts";
import { existingIds } from "@/utils/existing-ids.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";

/** Role ids of deleted roles aren't shown, so they aren't saved either. */
function withExistingRoles(roleRewards: XpRoleReward[], roles: Role[]): XpRoleReward[] {
	return roleRewards.map((roleReward) => ({
		...roleReward,
		roleIds: existingIds(roleReward.roleIds, roles),
	}));
}

export function LevelingRoleRewards({ defaultRoleRewards, premium, roles }: LevelingRoleRewardsProps) {
	const [roleRewards, setRoleRewards] = useState(() => withExistingRoles(defaultRoleRewards, roles));
	const [newRoles, setNewRoles] = useState<readonly Role[]>([]);
	const [newLevel, setNewLevel] = useState("");

	const maxRoleRewards = limitFor("xpRoleRewards", premium);
	const maxRoleRewardRoles = limitFor("xpRoleRewardRoles", premium);

	const isDuplicate = roleRewards.some((roleReward) => roleReward.level === Number.parseInt(newLevel, 10));

	const [prevDefaultRoleRewards, setPrevDefaultRoleRewards] = useState(defaultRoleRewards);
	if (prevDefaultRoleRewards !== defaultRoleRewards) {
		setPrevDefaultRoleRewards(defaultRoleRewards);
		setRoleRewards(withExistingRoles(defaultRoleRewards, roles));
	}

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
			roleRewards.length >= maxRoleRewards
		) {
			return;
		}

		setRoleRewards((prev) =>
			[...prev, { id: crypto.randomUUID(), level, roleIds, stack: true }].sort((a, b) => a.level - b.level),
		);

		setNewRoles([]);
		setNewLevel("");
	}

	function handleUpdateRoleReward(updated: XpRoleReward) {
		setRoleRewards((prev) => prev.map((roleReward) => (roleReward.id === updated.id ? updated : roleReward)));
	}

	function handleDeleteRoleReward(id: string) {
		setRoleRewards((prev) => prev.filter((roleReward) => roleReward.id !== id));
	}

	return (
		<>
			<input name="xpRoleRewards" type="hidden" value={JSON.stringify(roleRewards)} />

			<Label htmlFor="newXpRoleRewardLevel" sub={limitLabel("xpRoleRewardRoles", "roles per level")}>
				Create your role rewards…
			</Label>

			<div className="flex flex-wrap items-center gap-3">
				<p className="text-lg tracking-tight text-white/75 md:text-xl">Select your role: </p>

				<RoleSelector
					defaultValues={[]}
					inputId="role-rewards-sel"
					max={maxRoleRewardRoles}
					onChange={(newRoles) => setNewRoles(newRoles)}
					roles={roles}
				/>

				<p className="text-lg tracking-tight text-white/75 md:text-xl">and the level to reward it at: </p>

				<Input
					id="newXpRoleRewardLevel"
					max={MAX_XP_ROLE_REWARD_LEVEL}
					min={MIN_XP_ROLE_REWARD_LEVEL}
					name={null}
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
					<Label sub={limitLabel("xpRoleRewards", "rewards total")}>Manage your role rewards…</Label>

					{roleRewards.map((roleReward) => (
						<RoleRewardDisplay
							key={roleReward.id}
							maxRoles={maxRoleRewardRoles}
							onChange={handleUpdateRoleReward}
							onDelete={handleDeleteRoleReward}
							roleReward={roleReward}
							roles={roles}
						/>
					))}
				</>
			) : null}
		</>
	);
}

function RoleRewardDisplay({ maxRoles, onChange, onDelete, roleReward, roles }: RoleRewardDisplayProps) {
	const { id, level, roleIds, stack } = roleReward;

	return (
		<div className="flex flex-wrap items-center gap-4">
			<button
				className="group relative flex h-9 min-w-9 items-center justify-center rounded-lg border border-white bg-darker px-2 text-[#fff]"
				onClick={() => onDelete(id)}
				type="button"
			>
				<div className="absolute inset-0 hidden items-center justify-center rounded-lg border border-white bg-darker group-hover:flex">
					<Delete className="size-5 text-[#ed4245]" />
				</div>

				{level}
			</button>

			<div className="flex items-center gap-2 rounded-lg bg-darker p-2">
				<Toggle checked={stack} onChange={(event) => onChange({ ...roleReward, stack: event.target.checked })} />

				<span className="text-sm text-white/75">Stack</span>

				<DocsBubble
					path="/guides/leveling-automation#stacking-role-rewards"
					tooltip="When disabled, members will lose this role reward if they earn a higher level role reward"
				/>
			</div>

			<RoleSelector
				defaultValues={mapRoleIdsToRoles(roleIds, roles)}
				inputId={`role-rewards-${id}`}
				max={maxRoles}
				onChange={(newRoles) => onChange({ ...roleReward, roleIds: newRoles.map((role) => role.id) })}
				roles={roles}
			/>
		</div>
	);
}

interface RoleRewardDisplayProps {
	readonly maxRoles: number;
	onChange(roleReward: XpRoleReward): void;
	onDelete(id: string): void;
	readonly roleReward: XpRoleReward;
	readonly roles: Role[];
}

interface LevelingRoleRewardsProps {
	readonly defaultRoleRewards: XpRoleReward[];
	readonly premium: boolean;
	readonly roles: Role[];
}
