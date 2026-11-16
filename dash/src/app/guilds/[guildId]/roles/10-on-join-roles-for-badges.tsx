"use client";

import {
	ComboboxItem,
	ComboboxPopover,
	ComboboxSelect,
	ComboboxSelectArrow,
	ComboboxSelectLabel,
	useComboboxStore,
	useStoreState,
} from "@ariakit/react";
import Image from "next/image";
import { useState } from "react";
import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { Delete } from "@/components/icons/mdi/delete.tsx";
import { PersonAdd } from "@/components/icons/mdi/person-add.tsx";
import { MAX_AUTO_ROLE_FLAG_ROLES, MAX_AUTO_ROLE_FLAGS } from "@/lib/guild-config.ts";
import type { AutoRoleFlag, Role } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { existingIds } from "@/utils/existing-ids.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";
import { BadgeInfo, UserFlags } from "@/utils/user-flags.ts";

export function OnJoinRolesForBadges({ defaultValues, roles }: OnJoinRolesForBadgesProps) {
	const [autoRoleFlags, setAutoRoleFlags] = useState(() =>
		defaultValues.map((autoRoleFlag) => ({
			...autoRoleFlag,
			roleIds: existingIds(autoRoleFlag.roleIds, roles),
		})),
	);
	const [newRoleIds, setNewRoleIds] = useState<Snowflake[]>([]);

	const combobox = useComboboxStore({ defaultSelectedValue: UserFlags.ActiveDeveloper.toString() });
	const flag = useStoreState(combobox, "selectedValue");

	function handleCreate() {
		const flagId = Number.parseInt(flag, 10);

		if (
			Number.isNaN(flagId) ||
			!(flagId in BadgeInfo) ||
			newRoleIds.length === 0 ||
			newRoleIds.length > MAX_AUTO_ROLE_FLAG_ROLES ||
			autoRoleFlags.length >= MAX_AUTO_ROLE_FLAGS
		) {
			return;
		}

		setAutoRoleFlags((prev) =>
			[...prev, { flagId, id: crypto.randomUUID(), roleIds: newRoleIds }].sort((a, b) => a.flagId - b.flagId),
		);

		setNewRoleIds([]);
		combobox.setSelectedValue(UserFlags.ActiveDeveloper.toString());
	}

	function handleDelete(id: string) {
		setAutoRoleFlags((prev) => prev.filter((autoRoleFlag) => autoRoleFlag.id !== id));
	}

	function handleChangeRoles(id: string, roleIds: Snowflake[]) {
		setAutoRoleFlags((prev) =>
			prev.map((autoRoleFlag) => (autoRoleFlag.id === id ? { ...autoRoleFlag, roleIds } : autoRoleFlag)),
		);
	}

	const selectedBadgeInfo =
		flag in BadgeInfo ? BadgeInfo[flag as unknown as keyof typeof BadgeInfo] : BadgeInfo[UserFlags.ActiveDeveloper];

	return (
		<>
			<input name="autoRoleFlags" type="hidden" value={JSON.stringify(autoRoleFlags)} />

			<div className="flex flex-wrap items-center gap-3">
				<Text>Select your roles: </Text>

				<RoleSelector
					defaultValues={[]}
					inputId="role-selector"
					max={MAX_AUTO_ROLE_FLAG_ROLES}
					onChange={(newRoles) => setNewRoleIds(newRoles.map(({ id }) => id))}
					roles={roles}
				/>

				<ComboboxSelectLabel className="text-lg tracking-tight text-white/75 md:text-xl" store={combobox}>
					and the badge it will be applied on:{" "}
				</ComboboxSelectLabel>

				<ComboboxSelect
					className="flex h-10 w-64 items-center justify-between rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
					store={combobox}
				>
					<div className="flex items-center gap-2 truncate">
						<Image alt={`${selectedBadgeInfo.name} badge`} height={22} src={selectedBadgeInfo.icon} width={22} />
						{selectedBadgeInfo.name}
					</div>

					<ComboboxSelectArrow />
				</ComboboxSelect>

				<ComboboxPopover
					className="z-10000 flex w-80 flex-col gap-2 rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
					gutter={8}
					sameWidth
					store={combobox}
				>
					{Object.entries(BadgeInfo).map(([flag, { icon, name }]) => (
						<ComboboxItem
							className="flex cursor-pointer items-center gap-2 text-lg tracking-tight text-white/75 hover:text-white md:text-xl"
							key={`${flag}-badge-select`}
							store={combobox}
							value={flag}
						>
							<Image alt={`${name} badge`} height={22} src={icon} width={22} />
							{name}
						</ComboboxItem>
					))}
				</ComboboxPopover>

				<button
					className="rounded-lg bg-green p-1 transition-colors not-disabled:hover:bg-green/75"
					disabled={autoRoleFlags.length >= MAX_AUTO_ROLE_FLAGS || !newRoleIds.length || !flag}
					onClick={handleCreate}
					type="button"
				>
					<PersonAdd className="size-6 text-white" />
				</button>
			</div>

			{autoRoleFlags.length ? (
				<>
					<Label sub={`Max. ${MAX_AUTO_ROLE_FLAG_ROLES} roles`}>Manage your Badge-specific roles…</Label>

					{autoRoleFlags.map(({ flagId, id, roleIds }) => {
						const badgeInfo = BadgeInfo[flagId];

						return (
							<div className="flex items-center gap-4" key={id}>
								<button
									className="group relative flex size-10 items-center justify-center rounded-lg border border-white bg-darker text-lg text-[#fff] md:text-xl"
									onClick={() => handleDelete(id)}
									type="button"
								>
									<div className="absolute hidden size-10 items-center justify-center rounded-lg border border-white bg-darker group-hover:flex">
										<Delete className="size-5 text-[#ed4245]" />
									</div>

									<Image alt={`${badgeInfo.name} badge`} height={22} src={badgeInfo.icon} width={22} />
								</button>

								<RoleSelector
									defaultValues={mapRoleIdsToRoles(roleIds, roles)}
									inputId={`on-join-roles-for-badges-${id}`}
									max={MAX_AUTO_ROLE_FLAG_ROLES}
									onChange={(newRoles) =>
										handleChangeRoles(
											id,
											newRoles.map(({ id }) => id),
										)
									}
									roles={roles}
								/>
							</div>
						);
					})}
				</>
			) : null}
		</>
	);
}

interface OnJoinRolesForBadgesProps {
	readonly defaultValues: AutoRoleFlag[];
	readonly roles: Role[];
}
