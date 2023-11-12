"use client";

import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import {
	MAX_XP_MULTIPLIER_TARGETS,
	MAX_XP_MULTIPLIER_TARGETS_PREMIUM,
	MAX_XP_MULTIPLIER_VALUE,
} from "@/lib/guild-config.ts";
import { type Role, type XpMultiplier, XpMultiplierType } from "@/lib/guild.ts";
import { decimalRoleColorToHex } from "@/utils/decimal-to-hex-color.ts";
import { getMaximumLimit } from "@/utils/get-maximum-limit.ts";
import { BiSolidTrash } from "@react-icons/all-files/bi/BiSolidTrash";
import { MdPersonAddAlt1 } from "@react-icons/all-files/md/MdPersonAddAlt1";
import { useMemo, useState } from "react";

export function RoleMultipliers({ multipliers, premium, roles }: RoleMultipliersProps) {
	const [roleMultipliers, setRoleMultipliers] = useState<XpMultiplier[]>(() =>
		multipliers.filter((multiplier) => multiplier.type === XpMultiplierType.Role),
	);
	const [newRoles, setNewRoles] = useState<readonly Role[]>([]);
	const [newMultiplier, setNewMultiplier] = useState<string>("");
	const [totalMultiplierCount, setTotalMultiplierCount] = useState<number>(() => multipliers.length);

	const maxMultipliers = getMaximumLimit("xpMultipliers", premium);

	function handleCreateMultiplier() {
		const multiplier = Number.parseFloat(newMultiplier);
		const roleIds = newRoles.map(({ id }) => id);

		const maxTargets = getMaximumLimit("xpMultiplierTargets", premium);

		if (
			Number.isNaN(multiplier) ||
			multiplier < 0.01 ||
			multiplier > MAX_XP_MULTIPLIER_VALUE ||
			roleIds.length === 0 ||
			roleIds.length > maxTargets
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
		setTotalMultiplierCount((prev) => prev + 1);
	}

	function handleDeleteMultiplier(id: string) {
		setRoleMultipliers((prev) => prev.filter((multiplier) => multiplier.id !== id));
		setTotalMultiplierCount((prev) => prev - 1);
	}

	return (
		<>
			<div className="flex flex-wrap items-center gap-3">
				<Text>Select your roles:</Text>

				<RoleSelector
					defaultValues={[]}
					inputId="role-selector"
					max={getMaximumLimit("xpMultiplierTargets", premium)}
					roles={roles}
					settingId="newRoles"
					onChange={(newRoles) => setNewRoles(newRoles)}
				/>

				<Text>and the multiplier to apply to them:</Text>

				<input
					id="newLevel"
					placeholder="Enter a multiplier…"
					className="min-w-[12rem] max-w-3xl rounded-lg bg-light-gray p-2 px-3 shadow-dim-inner"
					type="number"
					value={newMultiplier}
					min={0.01}
					max={5}
					step={0.01}
					onChange={(event) => setNewMultiplier(event.target.value)}
				/>

				<button
					className="rounded-lg bg-green p-1 transition-colors [&:not(:disabled)]:hover:bg-green/75 disabled:cursor-not-allowed"
					onClick={handleCreateMultiplier}
					disabled={totalMultiplierCount >= maxMultipliers || !newRoles.length || !newMultiplier}
					type="button"
				>
					<MdPersonAddAlt1 color="white" size={24} />
				</button>
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
							roles={roles}
							onDelete={handleDeleteMultiplier}
							premium={premium}
						/>
					))}
				</>
			) : null}
		</>
	);
}

function RoleMultiplier({ id, multiplier, premium, onDelete, roles, targets }: RoleMultiplierProps) {
	const resolvedRoles = useMemo(
		() =>
			targets
				.map((roleId) => {
					const role = roles.find((role) => role.id === roleId);
					return role ? { ...role, resolvedColor: decimalRoleColorToHex(role.color) } : null!;
				})
				.filter(Boolean),
		[targets, roles],
	);

	return (
		<div className="flex items-center gap-4">
			<button
				className="group relative flex size-10 items-center justify-center rounded-lg border border-white/25 bg-[#1e1f22] text-lg text-[#fff] md:text-xl"
				onClick={() => onDelete(id)}
				type="button"
			>
				<div className="absolute hidden size-10 items-center justify-center rounded-lg border border-red bg-[#1e1f22] group-hover:flex">
					<BiSolidTrash color="#ed4245" size={19} />
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
}
