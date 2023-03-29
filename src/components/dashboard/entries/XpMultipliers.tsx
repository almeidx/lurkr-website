import cuid from "cuid";
import { useCallback, useState } from "react";
import { MdPlaylistAdd } from "react-icons/md";
import XpMultiplier, {
	type XpMultiplierOnDeleteFn,
	type XpMultiplierOnItemChangeFn,
	type XpMultiplierOnMultiplierChangeFn,
} from "@/dashboard/XpMultiplier";
import BasicSelect from "@/form/BasicSelect";
import Field from "@/form/Field";
import Label from "@/form/Label";
import {
	XpMultiplierType,
	type Channel,
	type GuildSettings,
	type Role,
	type XpMultiplier as IXpMultiplier,
	type AddChangeFn,
} from "~/contexts/GuildContext";
import { parseMultiplier } from "~/utils/common";
import type { Snowflake } from "~/utils/constants";
import { MAX_XP_MULTIPLIERS, MAX_XP_MULTIPLIERS_PREMIUM } from "~/utils/guild-config";

interface XpMultipliersProps {
	addChange: AddChangeFn;
	channels: Channel[];
	roles: Role[];
	settings: GuildSettings;
}

export function XpMultipliers({ addChange, channels, roles, settings }: XpMultipliersProps) {
	const [xpMultipliers, setXpMultipliers] = useState<MultiplierWithStringValue[]>(
		settings.xpMultipliers.map((multiplier) => ({
			...multiplier,
			multiplier: multiplier.multiplier.toString(),
		})),
	);
	const [newXpMultiplierType, setNewXpMultiplierType] = useState<XpMultiplierType>(XpMultiplierType.Channel);

	const handleXpMultiplierDelete: XpMultiplierOnDeleteFn = useCallback(
		(id) => {
			const clone = [...xpMultipliers];
			const index = clone.findIndex((multiplier) => multiplier.id === id);

			if (index < 0) {
				console.log(
					"[Leveling] Id provided was not presented in the xp multipliers array when the user tried deleting a multiplier",
				);
				return;
			}

			clone.splice(index, 1);

			setXpMultipliers(clone);
			addChange("xpMultipliers", resolveMultiplierValues(clone));
		},
		[addChange, xpMultipliers],
	);

	const handleXpMultiplierItemsChange: XpMultiplierOnItemChangeFn = useCallback(
		(itemIds, id) => {
			const clone = [...xpMultipliers];
			const index = clone.findIndex((multiplier) => multiplier.id === id);

			if (index < 0) {
				console.log(
					"[Leveling] Id provided was not presented in the xp multipliers array when the user tried changing the items of a multiplier",
				);
				return;
			}

			const multiplier = clone[index]!;
			if (!multiplier.targets) {
				console.log(
					"[Leveling] The multiplier found did not have targets when the user tried changing the items of a multiplier",
				);
				return;
			}

			multiplier.targets = itemIds;
			clone[index] = multiplier;

			setXpMultipliers(clone);
			addChange("xpMultipliers", resolveMultiplierValues(clone));
		},
		[addChange, xpMultipliers],
	);

	const handleXpMultiplierValueChange: XpMultiplierOnMultiplierChangeFn = useCallback(
		(multiplier, id) => {
			const clone = [...xpMultipliers];
			const index = clone.findIndex((multiplier) => multiplier.id === id);

			if (index < 0) {
				console.log(
					"[Leveling] Index provided was not presented in the xp multipliers array when the user tried changing the items of a multiplier",
				);
				return;
			}

			const xpMultiplier = clone[index]!;
			xpMultiplier.multiplier = multiplier;

			clone[index] = xpMultiplier;

			setXpMultipliers(clone);
			addChange("xpMultipliers", resolveMultiplierValues(clone));
		},
		[addChange, xpMultipliers],
	);

	const xpMultipliersLimit = settings.premium ? MAX_XP_MULTIPLIERS_PREMIUM : MAX_XP_MULTIPLIERS;

	return (
		<Field>
			<Label
				htmlFor="xpMultipliers"
				name="Leveling Multipliers"
				url="https://docs.lurkr.gg/guides/setting-up-xp-multipliers"
			/>
			<div>
				{xpMultipliers.length < xpMultipliersLimit && (
					<div className="flex max-w-md flex-col">
						<p className="text-white">Create a new multiplier</p>
						<div className="mb-4 mt-2 flex flex-row gap-3">
							<BasicSelect
								closeOnSelect
								initialItem="Channel"
								items={
									xpMultipliers.some((multiplier) => multiplier.type === XpMultiplierType.Global)
										? ["Channel", "Role"]
										: ["Channel", "Global", "Role"]
								}
								onSelect={(type) => setNewXpMultiplierType(type as XpMultiplierType)}
							/>
							<button
								className="bg-discord-not-quite-black flex h-12 w-12 shrink-0 items-center justify-center rounded-md text-white transition-colors duration-150 hover:text-opacity-75"
								onClick={(event) => {
									event.preventDefault();

									const finalMultipliers = [
										...xpMultipliers,
										{ id: cuid(), multiplier: "1", targets: [], type: newXpMultiplierType },
									];
									setXpMultipliers(finalMultipliers);
									addChange("xpMultipliers", resolveMultiplierValues(finalMultipliers));
								}}
								type="button"
							>
								<MdPlaylistAdd className="fill-current text-3xl" />
							</button>
						</div>
					</div>
				)}
			</div>
			<div className="flex flex-col gap-y-2">
				{xpMultipliers.map(({ id, multiplier, targets, type }) => (
					<XpMultiplier
						channels={channels}
						id={id}
						key={id}
						multiplier={multiplier}
						onDelete={handleXpMultiplierDelete}
						onItemChange={handleXpMultiplierItemsChange}
						onMultiplierChange={handleXpMultiplierValueChange}
						premium={settings.premium}
						roles={roles}
						targets={targets as Snowflake[]}
						type={type}
					/>
				))}
			</div>
		</Field>
	);
}

function resolveMultiplierValues(multipliers: MultiplierWithStringValue[]) {
	return multipliers.map((multiplier) => ({
		...multiplier,
		multiplier: parseMultiplier(multiplier.multiplier) ?? Number.NaN,
	}));
}

type MultiplierWithStringValue = Omit<IXpMultiplier, "multiplier"> & { multiplier: string };
