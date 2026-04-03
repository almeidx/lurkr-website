"use client";

import { useState } from "react";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { Separator } from "@/components/Separator.tsx";
import type { Channel, Role, XpMultiplier } from "@/lib/guild.ts";
import { RoleMultipliers } from "./11-role-multipliers.tsx";
import { RoleMultiplierPriority } from "./12-role-multiplier-priority.tsx";
import { ChannelMultipliers } from "./13-channel-multipliers.tsx";

export function MultipliersWithTargets({
	channels,
	multipliers,
	premium,
	prioritiseMultiplierRoleHierarchy,
	roles,
}: MultipliersProps) {
	const [multiplierCount, setMultiplierCount] = useState(multipliers.length);

	return (
		<>
			<Section name="Role Multipliers">
				<Text
					docsPath="/guides/setting-up-leveling-multipliers#setting-role-multipliers"
					htmlFor="role-selector"
					tooltip="Choose certain roles that, if a member has at least one of, will multiply with the global multiplier. The end multiplier is calculated by this formula: Global Multiplier x Channel Multiplier x Role Multiplier."
				>
					Setup role multipliers that only apply to members in those roles…
				</Text>

				<RoleMultipliers
					multiplierCount={multiplierCount}
					multipliers={multipliers}
					premium={premium}
					roles={roles}
					setMultiplierCount={setMultiplierCount}
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

				<ChannelMultipliers
					channels={channels}
					multiplierCount={multiplierCount}
					multipliers={multipliers}
					premium={premium}
					setMultiplierCount={setMultiplierCount}
				/>
			</Section>
		</>
	);
}

interface MultipliersProps {
	readonly channels: Channel[];
	readonly multipliers: XpMultiplier[];
	readonly premium: boolean;
	readonly prioritiseMultiplierRoleHierarchy: boolean;
	readonly roles: Role[];
}
