"use client";

import { Label as HeroLabel, ListBox, Select } from "@heroui/react";
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

	const [flag, setFlag] = useState(UserFlags.ActiveDeveloper.toString());

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
		setFlag(UserFlags.ActiveDeveloper.toString());
	}

	function handleDelete(id: string) {
		setAutoRoleFlags((prev) => prev.filter((autoRoleFlag) => autoRoleFlag.id !== id));
	}

	function handleChangeRoles(id: string, roleIds: Snowflake[]) {
		setAutoRoleFlags((prev) =>
			prev.map((autoRoleFlag) => (autoRoleFlag.id === id ? { ...autoRoleFlag, roleIds } : autoRoleFlag)),
		);
	}

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

				<Select
					className="contents"
					onChange={(key) => {
						if (key) setFlag(key.toString());
					}}
					value={flag}
				>
					<HeroLabel className="text-lg font-normal tracking-tight text-white/75 md:text-xl">
						and the badge it will be applied on:{" "}
					</HeroLabel>

					<Select.Trigger className="h-10 w-64 items-center rounded-lg border-0 bg-light-gray shadow-dim-inner">
						<Select.Value className="flex items-center gap-2 truncate text-base sm:text-base" />
						<Select.Indicator />
					</Select.Trigger>

					<Select.Popover className="w-80 rounded-lg bg-light-gray shadow-dim-inner">
						<ListBox>
							{Object.entries(BadgeInfo).map(([flag, { icon, name }]) => (
								<ListBox.Item
									className="gap-2 rounded-lg text-lg tracking-tight text-white/75 data-focus-visible:text-white data-hovered:text-white md:text-xl"
									id={flag}
									key={`${flag}-badge-select`}
									textValue={name}
								>
									<Image alt={`${name} badge`} height={22} src={icon} width={22} />
									{name}
									<ListBox.ItemIndicator />
								</ListBox.Item>
							))}
						</ListBox>
					</Select.Popover>
				</Select>

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
