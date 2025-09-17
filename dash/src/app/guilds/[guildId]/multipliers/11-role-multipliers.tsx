import "client-only";

// The reason for using "client-only" instead of "use client" is because of the function parameter in the component,
// which triggers a warning since functions are not serializable.

import { type Dispatch, type SetStateAction, useState } from "react";
import { Input } from "@/components/dashboard/Input.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { AddComment } from "@/components/icons/mdi/add-comment.tsx";
import { Delete } from "@/components/icons/mdi/delete.tsx";
import { type Role, type XpMultiplier, XpMultiplierType } from "@/lib/guild.ts";
import {
	MAX_XP_MULTIPLIER_TARGETS,
	MAX_XP_MULTIPLIER_TARGETS_PREMIUM,
	MAX_XP_MULTIPLIER_VALUE,
	MIN_XP_MULTIPLIER_VALUE,
} from "@/lib/guild-config.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";
import { CreateMultiplierButton } from "./create-multiplier-button.tsx";

export function RoleMultipliers({
	multipliers,
	premium,
	roles,
	multiplierCount,
	setMultiplierCount,
}: RoleMultipliersProps) {
	const [roleMultipliers, setRoleMultipliers] = useState<XpMultiplier[]>(() =>
		multipliers.filter((multiplier) => multiplier.type === XpMultiplierType.Role),
	);
	const [newRoles, setNewRoles] = useState<readonly Role[]>([]);
	const [newMultiplier, setNewMultiplier] = useState<string>("");

	const existingMultiplierValues = roleMultipliers.map(({ multiplier }) => multiplier);

	const maxMultipliers = getMaximumLimit("xpMultipliers", premium);

	function handleCreateMultiplier() {
		const multiplier = Number.parseFloat(newMultiplier);
		const roleIds = newRoles.map(({ id }) => id);

		const maxTargets = getMaximumLimit("xpMultiplierTargets", premium);

		if (
			Number.isNaN(multiplier) ||
			multiplier < MIN_XP_MULTIPLIER_VALUE ||
			multiplier > MAX_XP_MULTIPLIER_VALUE ||
			roleIds.length === 0 ||
			roleIds.length > maxTargets ||
			multiplierCount >= maxMultipliers
		) {
			return;
		}

		setRoleMultipliers((prev) =>
			[...prev, { id: crypto.randomUUID(), multiplier, targets: roleIds, type: XpMultiplierType.Role }].sort(
				(a, b) => a.multiplier - b.multiplier,
			),
		);

		setNewRoles([]);
		setNewMultiplier("");
		setMultiplierCount((prev) => prev + 1);
	}

	function handleDeleteMultiplier(id: string) {
		setRoleMultipliers((prev) => prev.filter((multiplier) => multiplier.id !== id));
		setMultiplierCount((prev) => prev - 1);
	}

	return (
		<>
			<div className="flex flex-wrap items-center gap-3">
				<Text>Select your roles:</Text>

				<RoleSelector
					defaultValues={[]}
					inputId="role-selector"
					max={getMaximumLimit("xpMultiplierTargets", premium)}
					onChange={(newRoles) => setNewRoles(newRoles)}
					roles={roles}
					settingId="newRoles"
				/>

				<Text>and the multiplier to apply to them:</Text>

				<Input
					id="newLevel"
					max={MAX_XP_MULTIPLIER_VALUE}
					min={MIN_XP_MULTIPLIER_VALUE}
					onChange={(event) => setNewMultiplier(event.target.value)}
					placeholder="Enter a multiplier…"
					step={MIN_XP_MULTIPLIER_VALUE}
					type="number"
					value={newMultiplier}
				/>

				<CreateMultiplierButton
					existingMultiplierValues={existingMultiplierValues}
					handleCreateMultiplier={handleCreateMultiplier}
					maxMultipliers={maxMultipliers}
					multiplierCount={multiplierCount}
					newMultiplier={newMultiplier}
					newTargets={newRoles}
				>
					<AddComment className="size-6 text-white" />
				</CreateMultiplierButton>
			</div>

			{roleMultipliers.length ? (
				<>
					<Label
						sub={`Max. ${MAX_XP_MULTIPLIER_TARGETS} roles total - Max. ${MAX_XP_MULTIPLIER_TARGETS_PREMIUM} for Premium`}
					>
						Manage your role multipliers…
					</Label>

					{roleMultipliers.map((multiplier) => (
						<RoleMultiplier
							key={multiplier.id}
							{...multiplier}
							onDelete={handleDeleteMultiplier}
							premium={premium}
							roles={roles}
						/>
					))}
				</>
			) : null}
		</>
	);
}

function RoleMultiplier({ id, multiplier, premium, onDelete, roles, targets }: RoleMultiplierProps) {
	const resolvedRoles = mapRoleIdsToRoles(targets, roles);

	return (
		<div className="flex items-center gap-4">
			<button
				className="group relative flex size-10 items-center justify-center rounded-lg border border-white/25 bg-darker text-[#fff] text-lg md:text-xl"
				onClick={() => onDelete(id)}
				type="button"
			>
				<div className="absolute hidden size-10 items-center justify-center rounded-lg border border-red bg-darker group-hover:flex">
					<Delete className="size-5 text-[#ed4245]" />
				</div>

				{multiplier}
			</button>

			<RoleSelector
				defaultValues={resolvedRoles}
				inputId={`role-multipliers-${id}`}
				max={getMaximumLimit("xpMultiplierTargets", premium)}
				roles={roles}
				settingId={`xpMultipliers-${XpMultiplierType.Role}-${multiplier}-${id}`}
			/>
		</div>
	);
}

type RoleMultiplierProps = Omit<XpMultiplier, "type"> & {
	onDelete(id: string): void;
	readonly premium: boolean;
	readonly roles: Role[];
};

interface RoleMultipliersProps {
	readonly multipliers: XpMultiplier[];
	readonly premium: boolean;
	readonly roles: Role[];
	readonly multiplierCount: number;
	readonly setMultiplierCount: Dispatch<SetStateAction<number>>;
}
