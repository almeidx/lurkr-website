import { useCallback, useMemo, useRef, useState } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import XpRole, { type XpRoleOnChangeFn } from "@/dashboard/XpRole";
import Field from "@/form/Field";
import Input from "@/form/Input";
import Label from "@/form/Label";
import type { AddChangeFn, GuildSettings, Role, XpRoleReward } from "~/contexts/GuildContext";
import { parseIntStrict } from "~/utils/common";
import {
	MAX_XP_ROLE_REWARDS,
	MAX_XP_ROLE_REWARDS_PREMIUM,
	MAX_XP_ROLE_REWARD_LEVEL,
	MIN_XP_ROLE_REWARD_LEVEL,
} from "~/utils/guild-config";

interface XpRoleRewardsProps {
	readonly addChange: AddChangeFn;
	readonly roles: Role[];
	readonly settings: GuildSettings;
}

let timeout: NodeJS.Timeout | undefined;

export function XpRoleRewards({ addChange, roles, settings }: XpRoleRewardsProps) {
	const [xpRoleRewards, setXpRoleRewards] = useState<XpRoleReward[]>(settings.xpRoleRewards);
	const [newXpRolesLevel, setNewXpRolesLevel] = useState<string>("");
	const newXpRoleSubmitRef = useRef<HTMLButtonElement>(null);

	const sortedRoleRewards = useMemo(() => xpRoleRewards.sort((a, b) => a.level - b.level), [xpRoleRewards]);

	const handleNewXpRoleCreated: () => unknown = useCallback(() => {
		const clone = [...xpRoleRewards];
		const level = parseIntStrict(newXpRolesLevel);

		if (
			Number.isNaN(level) ||
			clone.some((roleReward) => roleReward.level === level) ||
			level < MIN_XP_ROLE_REWARD_LEVEL ||
			level > MAX_XP_ROLE_REWARD_LEVEL
		) {
			if (newXpRoleSubmitRef.current) {
				newXpRoleSubmitRef.current.style.color = "#ed4245";
			}

			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(() => {
				if (newXpRoleSubmitRef.current) {
					newXpRoleSubmitRef.current.style.color = "#fff";
				}
			}, 1_000);
		} else {
			clone.push({ id: crypto.randomUUID(), level, roleIds: [] });

			setXpRoleRewards(clone);
			addChange("xpRoleRewards", clone);
		}
	}, [addChange, newXpRolesLevel, xpRoleRewards, newXpRoleSubmitRef]);

	const handleXpRolesChange: XpRoleOnChangeFn = useCallback(
		(roleIds, level) => {
			const clone = [...xpRoleRewards];

			const index = clone.findIndex((role) => role.level === level);

			if (roleIds.length) {
				if (index === -1) {
					clone.push({ id: crypto.randomUUID(), level, roleIds });
				} else {
					clone[index]!.roleIds = roleIds;
				}
			} else {
				clone.splice(index, 1);
			}

			setXpRoleRewards(clone);
			addChange("xpRoleRewards", clone);
		},
		[addChange, xpRoleRewards],
	);

	const xpRoleRewardsLimit = settings.premium ? MAX_XP_ROLE_REWARDS_PREMIUM : MAX_XP_ROLE_REWARDS;

	return (
		<Field>
			<Label
				htmlFor="xpRoleRewards"
				name="Leveling Role Rewards"
				url="https://docs.lurkr.gg/guides/setting-up-server-xp-leveling#adding-role-rewards"
			/>
			<div className="mb-4 divide-y-2">
				{xpRoleRewards.length < xpRoleRewardsLimit && (
					<div className="flex max-w-md flex-col gap-2">
						<p className="text-white">Create a new role reward</p>

						<Input
							clearOnSubmit
							id="newXpRole"
							initialValue=""
							maxLength={3}
							onChange={(text) => (text ? /^\d+$/.test(text) && setNewXpRolesLevel(text) : setNewXpRolesLevel(""))}
							onSubmit={handleNewXpRoleCreated}
							placeholder="Enter a level to reward roles to"
							submitIcon={MdPlaylistAdd}
							submitRef={newXpRoleSubmitRef}
						/>
					</div>
				)}
			</div>
			<div className="mb-4 flex flex-col gap-y-2">
				{sortedRoleRewards.map(({ level, roleIds }) => (
					<XpRole
						initialRoles={roleIds}
						key={level}
						level={level}
						onChange={handleXpRolesChange}
						premium={settings.premium}
						roles={roles}
					/>
				))}
			</div>
		</Field>
	);
}
