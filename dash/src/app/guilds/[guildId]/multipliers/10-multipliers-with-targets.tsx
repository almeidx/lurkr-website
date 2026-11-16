"use client";

import { useState } from "react";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { Separator } from "@/components/Separator.tsx";
import { type Channel, type Role, type XpMultiplier, XpMultiplierType } from "@/lib/guild.ts";
import { existingIds } from "@/utils/existing-ids.ts";
import { TargetMultipliers } from "./11-target-multipliers.tsx";
import { RoleMultiplierPriority } from "./12-role-multiplier-priority.tsx";

export function MultipliersWithTargets({
	channels,
	defaultMultipliers,
	premium,
	prioritiseMultiplierRoleHierarchy,
	roles,
}: MultipliersProps) {
	const [multipliers, setMultipliers] = useState(() =>
		defaultMultipliers.map((multiplier) => ({
			...multiplier,
			targets: existingIds(multiplier.targets, multiplier.type === XpMultiplierType.Role ? roles : channels),
		})),
	);

	return (
		<>
			<input name="xpMultipliers" type="hidden" value={JSON.stringify(multipliers)} />

			<Section name="Role Multipliers">
				<Text
					docsPath="/guides/setting-up-leveling-multipliers#setting-role-multipliers"
					htmlFor="role-selector"
					tooltip="Choose certain roles that, if a member has at least one of, will multiply with the global multiplier. The end multiplier is calculated by this formula: Global Multiplier x Channel Multiplier x Role Multiplier."
				>
					Setup role multipliers that only apply to members in those roles…
				</Text>

				<TargetMultipliers
					channels={channels}
					multipliers={multipliers}
					premium={premium}
					roles={roles}
					setMultipliers={setMultipliers}
					type={XpMultiplierType.Role}
				/>

				<Separator />

				<Text
					docsPath="/guides/setting-up-leveling-multipliers#changing-role-multiplier-hierarchy"
					tooltip="Changes the behaviour when more than one assigned role has different multipliers attached. Either the highest role as it appears in the server settings menu is chosen, or the role with the highest multiplier."
				>
					When more than one role multiplier applies, use the one with…
				</Text>

				<RoleMultiplierPriority defaultValue={prioritiseMultiplierRoleHierarchy} />
			</Section>

			<Section name="Channel Multipliers">
				<Text
					docsPath="/guides/setting-up-leveling-multipliers#setting-channel-multipliers"
					htmlFor="channel-selector"
					tooltip="Choose certain channels that, if a member is chatting in one of those channels, will multiply with the global multiplier. The end multiplier is calculated by this formula: Global Multiplier x Channel Multiplier x Role Multiplier."
				>
					Setup channel multipliers that only apply to members chatting in those channels…
				</Text>

				<TargetMultipliers
					channels={channels}
					multipliers={multipliers}
					premium={premium}
					roles={roles}
					setMultipliers={setMultipliers}
					type={XpMultiplierType.Channel}
				/>
			</Section>
		</>
	);
}

interface MultipliersProps {
	readonly channels: Channel[];
	readonly defaultMultipliers: XpMultiplier[];
	readonly premium: boolean;
	readonly prioritiseMultiplierRoleHierarchy: boolean;
	readonly roles: Role[];
}
