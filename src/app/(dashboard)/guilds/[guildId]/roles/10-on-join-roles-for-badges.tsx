"use client";

import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector, type RoleWithResolvedColor } from "@/components/dashboard/RoleSelector.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { Delete } from "@/components/icons/mdi/delete.tsx";
import { PersonAdd } from "@/components/icons/mdi/person-add.tsx";
import { MAX_AUTO_ROLE_FLAGS_ROLES } from "@/lib/guild-config.ts";
import type { AutoRoleFlag, Role } from "@/lib/guild.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";
import { BadgeInfo, UserFlags } from "@/utils/user-flags.ts";
import {
	Select,
	SelectArrow,
	SelectItem,
	SelectLabel,
	SelectPopover,
	useSelectStore,
	useStoreState,
} from "@ariakit/react";
import Image from "next/image";
import { useState } from "react";

export function OnJoinRolesForBadges({ defaultValues, premium, roles }: OnJoinRolesForBadgesProps) {
	const [autoRoleFlags, setAutoRoleFlags] = useState<readonly AutoRoleFlag[]>(defaultValues);
	const [newRoles, setNewRoles] = useState<readonly RoleWithResolvedColor[]>([]);
	const select = useSelectStore({ defaultValue: UserFlags.ActiveDeveloper.toString() });
	const flag = useStoreState(select, "value");

	const maxAutoRoleFlags = getMaximumLimit("autoRoleFlags", premium);

	function handleCreate() {
		const flagId = Number.parseInt(flag, 10);
		const roleIds = newRoles.map(({ id }) => id);

		if (
			Number.isNaN(flagId) ||
			!(flagId in BadgeInfo) ||
			roleIds.length === 0 ||
			roleIds.length >= MAX_AUTO_ROLE_FLAGS_ROLES ||
			autoRoleFlags.length >= maxAutoRoleFlags
		) {
			return;
		}

		setAutoRoleFlags((prev) =>
			[...prev, { id: crypto.randomUUID(), flagId, roleIds }].sort((a, b) => a.flagId - b.flagId),
		);

		setNewRoles([]);
		select.setValue(UserFlags.ActiveDeveloper.toString());
	}

	function handleDelete(id: string) {
		setAutoRoleFlags((prev) => prev.filter((autoRoleFlag) => autoRoleFlag.id !== id));
	}

	const selectedBadgeInfo =
		flag in BadgeInfo ? BadgeInfo[flag as unknown as keyof typeof BadgeInfo] : BadgeInfo[UserFlags.ActiveDeveloper];

	return (
		<>
			<div className="flex flex-wrap items-center gap-3">
				<Text>Select your roles: </Text>

				<RoleSelector
					defaultValues={[]}
					inputId="role-selector"
					max={getMaximumLimit("autoRoleFlags", premium)}
					roles={roles}
					settingId="newRoles"
					onChange={(newRoles) => setNewRoles(newRoles)}
				/>

				<SelectLabel className="text-lg text-white/75 tracking-tight md:text-xl" store={select}>
					and the badge it will be applied on:{" "}
				</SelectLabel>

				<Select
					store={select}
					className="flex h-10 w-64 items-center justify-between rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
				>
					<div className="flex items-center gap-2 truncate">
						<Image src={selectedBadgeInfo.icon} alt={`${selectedBadgeInfo.name} badge`} width={22} height={22} />
						{selectedBadgeInfo.name}
					</div>

					<SelectArrow />
				</Select>

				<SelectPopover
					store={select}
					gutter={8}
					sameWidth
					className="z-10000 flex w-80 flex-col gap-2 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
				>
					{Object.entries(BadgeInfo).map(([flag, { icon, name }]) => (
						<SelectItem
							key={`${flag}-badge-select`}
							className="flex cursor-pointer items-center gap-2 text-lg text-white/75 tracking-tight hover:text-white md:text-xl"
							store={select}
							value={flag}
						>
							<Image src={icon} alt={`${name} badge`} width={22} height={22} />
							{name}
						</SelectItem>
					))}
				</SelectPopover>

				<button
					className="rounded-lg bg-green p-1 transition-colors not-disabled:hover:bg-green/75"
					onClick={handleCreate}
					disabled={autoRoleFlags.length >= maxAutoRoleFlags || !newRoles.length || !flag}
					type="button"
				>
					<PersonAdd className="size-6 text-white" />
				</button>
			</div>

			{autoRoleFlags.length ? (
				<>
					<Label sub={`Max. ${MAX_AUTO_ROLE_FLAGS_ROLES} roles`}>Manage your Badge-specific roles…</Label>

					{autoRoleFlags.map((autoRoleFlag) => (
						<OnJoinRoleBadge
							key={autoRoleFlag.id}
							{...autoRoleFlag}
							roles={roles}
							onDelete={handleDelete}
							premium={premium}
						/>
					))}
				</>
			) : null}
		</>
	);
}

function OnJoinRoleBadge({ flagId, id, premium, onDelete, roleIds, roles }: OnJoinRoleBadgeProps) {
	const resolvedRoles = mapRoleIdsToRoles(roleIds, roles);

	const badgeInfo = BadgeInfo[flagId];

	return (
		<div className="flex items-center gap-4">
			<button
				className="group relative flex size-10 items-center justify-center rounded-lg border border-white bg-[#1e1f22] text-[#fff] text-lg md:text-xl"
				onClick={() => onDelete(id)}
				type="button"
			>
				<div className="absolute hidden size-10 items-center justify-center rounded-lg border border-white bg-[#1e1f22] group-hover:flex">
					<Delete className="size-5 text-[#ed4245]" />
				</div>

				<Image src={badgeInfo.icon} alt={`${badgeInfo.name} badge`} width={22} height={22} />
			</button>

			<RoleSelector
				defaultValues={resolvedRoles}
				inputId={`on-join-roles-for-badges-${id}`}
				max={getMaximumLimit("autoRoleFlags", premium)}
				roles={roles}
				settingId={`autoRoleFlags-${flagId}-${id}`}
			/>
		</div>
	);
}

type OnJoinRoleBadgeProps = AutoRoleFlag & {
	onDelete(id: string): void;
	readonly premium: boolean;
	readonly roles: Role[];
};

interface OnJoinRolesForBadgesProps {
	readonly defaultValues: AutoRoleFlag[];
	readonly premium: boolean;
	readonly roles: Role[];
}
