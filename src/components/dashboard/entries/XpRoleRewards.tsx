import { useCallback, useMemo, useRef, useState } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import type { AddChangeFn, GuildSettings, Role, XpRoleReward } from "../../../contexts/GuildContext";
import { getDatabaseLimit, parseIntStrict } from "../../../utils/common";
import Field from "../../form/Field";
import Input from "../../form/Input";
import Label from "../../form/Label";
import XpRole, { type XpRoleOnChangeFn } from "../XpRole";

interface XpRoleRewardsProps {
	addChange: AddChangeFn;
	roles: Role[];
	settings: GuildSettings;
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

		if (Number.isNaN(level) || clone.some((roleReward) => roleReward.level === level) || level <= 0 || level > 500) {
			if (newXpRoleSubmitRef.current) {
				newXpRoleSubmitRef.current.style.color = "#ed4245";
			}

			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(() => {
				if (newXpRoleSubmitRef.current) {
					newXpRoleSubmitRef.current.style.color = "#fff";
				}
			}, 1_000);
		} else {
			clone.push({ level, roleIds: [] });

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
					clone.push({
						level,
						roleIds,
					});
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

	const xpRoleRewardsLimit = getDatabaseLimit("xpRoleRewards", settings.premium).maxLength;

	return (
		<Field>
			<Label
				htmlFor="xpRoleRewards"
				name="Leveling Role Rewards"
				url="https://docs.pepemanager.com/guides/setting-up-server-xp-leveling#adding-role-rewards"
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
