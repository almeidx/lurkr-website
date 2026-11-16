import { type Dispatch, type SetStateAction, useState } from "react";
import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { RoleSelector } from "@/components/dashboard/RoleSelector.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { AddComment } from "@/components/icons/mdi/add-comment.tsx";
import { Delete } from "@/components/icons/mdi/delete.tsx";
import { limitFor, limitLabel, MAX_XP_MULTIPLIER_VALUE, MIN_XP_MULTIPLIER_VALUE } from "@/lib/guild-config.ts";
import { type Channel, type Role, type XpMultiplier, XpMultiplierType } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";
import { mapRoleIdsToRoles } from "@/utils/map-role-ids-to-roles.ts";
import { CreateMultiplierButton } from "./create-multiplier-button.tsx";

const TARGET_NAMES = {
	[XpMultiplierType.Channel]: { plural: "channels", singular: "channel" },
	[XpMultiplierType.Role]: { plural: "roles", singular: "role" },
} as const;

export function TargetMultipliers({
	channels,
	multipliers,
	premium,
	roles,
	setMultipliers,
	type,
}: TargetMultipliersProps) {
	const [newTargets, setNewTargets] = useState<readonly Snowflake[]>([]);
	const [newMultiplier, setNewMultiplier] = useState("");

	const typeMultipliers = multipliers.filter((multiplier) => multiplier.type === type);
	const existingMultiplierValues = typeMultipliers.map(({ multiplier }) => multiplier);
	const maxMultipliers = limitFor("xpMultipliers", premium);
	const maxTargets = limitFor("xpMultiplierTargets", premium);
	const { plural: targetName, singular: targetNoun } = TARGET_NAMES[type];

	function handleCreateMultiplier() {
		const multiplier = Number.parseFloat(newMultiplier);

		if (
			Number.isNaN(multiplier) ||
			multiplier < MIN_XP_MULTIPLIER_VALUE ||
			multiplier > MAX_XP_MULTIPLIER_VALUE ||
			newTargets.length === 0 ||
			newTargets.length > maxTargets ||
			multipliers.length >= maxMultipliers
		) {
			return;
		}

		setMultipliers((prev) =>
			[...prev, { id: crypto.randomUUID(), multiplier, targets: [...newTargets], type }].sort(
				(a, b) => a.multiplier - b.multiplier,
			),
		);

		setNewTargets([]);
		setNewMultiplier("");
	}

	function handleDeleteMultiplier(id: string) {
		setMultipliers((prev) => prev.filter((multiplier) => multiplier.id !== id));
	}

	function handleChangeTargets(id: string, targets: Snowflake[]) {
		setMultipliers((prev) =>
			prev.map((multiplier) => (multiplier.id === id ? { ...multiplier, targets } : multiplier)),
		);
	}

	return (
		<>
			<div className="flex flex-wrap items-center gap-3">
				<Text>Select your {targetName}:</Text>

				<TargetSelector
					channels={channels}
					inputId={`${targetNoun}-selector`}
					max={maxTargets}
					onChange={setNewTargets}
					roles={roles}
					targets={[]}
					type={type}
				/>

				<Text>and the multiplier to apply to them:</Text>

				<Input
					id={`new-${targetNoun}-multiplier`}
					max={MAX_XP_MULTIPLIER_VALUE}
					min={MIN_XP_MULTIPLIER_VALUE}
					name={null}
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
					multiplierCount={multipliers.length}
					newMultiplier={newMultiplier}
					newTargets={newTargets}
				>
					<AddComment className="size-6 text-white" />
				</CreateMultiplierButton>
			</div>

			{typeMultipliers.length ? (
				<>
					<Label sub={limitLabel("xpMultiplierTargets", `${targetName} total`)}>
						Manage your {targetNoun} multipliers…
					</Label>

					{typeMultipliers.map(({ id, multiplier, targets }) => (
						<div className="flex items-center gap-4" key={id}>
							<button
								className="group relative flex size-10 items-center justify-center rounded-lg border border-white/25 bg-darker text-lg text-[#fff] md:text-xl"
								onClick={() => handleDeleteMultiplier(id)}
								type="button"
							>
								<div className="absolute hidden size-10 items-center justify-center rounded-lg border border-red bg-darker group-hover:flex">
									<Delete className="size-5 text-[#ed4245]" />
								</div>

								{multiplier}
							</button>

							<TargetSelector
								channels={channels}
								inputId={`${targetNoun}-multipliers-${id}`}
								max={maxTargets}
								onChange={(newTargets) => handleChangeTargets(id, newTargets)}
								roles={roles}
								targets={targets}
								type={type}
							/>
						</div>
					))}
				</>
			) : null}
		</>
	);
}

function TargetSelector({ channels, inputId, max, onChange, roles, targets, type }: TargetSelectorProps) {
	if (type === XpMultiplierType.Role) {
		return (
			<RoleSelector
				defaultValues={mapRoleIdsToRoles(targets, roles)}
				inputId={inputId}
				max={max}
				onChange={(values) => onChange(values.map(({ id }) => id))}
				roles={roles}
			/>
		);
	}

	return (
		<ChannelSelector
			channels={channels}
			defaultValues={mapChannelIdsToChannels(targets, channels)}
			inputId={inputId}
			max={max}
			menuPlacement="top" // Placing the menu on top always to avoid overflow
			onChange={(values) => onChange(values.map(({ id }) => id))}
		/>
	);
}

interface TargetSelectorProps {
	readonly channels: Channel[];
	readonly inputId: string;
	readonly max: number;
	onChange(targets: Snowflake[]): void;
	readonly roles: Role[];
	readonly targets: Snowflake[];
	readonly type: XpMultiplierType;
}

interface TargetMultipliersProps {
	readonly channels: Channel[];
	readonly multipliers: readonly XpMultiplier[];
	readonly premium: boolean;
	readonly roles: Role[];
	readonly setMultipliers: Dispatch<SetStateAction<XpMultiplier[]>>;
	readonly type: XpMultiplierType;
}
