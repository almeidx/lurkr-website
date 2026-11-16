import type { Metadata } from "next";
import { getGuildSettings } from "@/app/guilds/[guildId]/settings.ts";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Separator } from "@/components/Separator.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { GlobalMultipliers } from "./01-global-multipliers.tsx";
import { VoteBoost } from "./02-vote-boost.tsx";
import { MultipliersWithTargets } from "./10-multipliers-with-targets.tsx";
import { update } from "./update.ts";

export default async function Multipliers({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;
	const { guild, settings } = await getGuildSettings(guildId);
	const action = update.bind(null, guildId, guild.premium);

	return (
		<Form action={action} description="Change who gains how much experience, and where!" title="Multipliers">
			<Section id="global-multiplier" name="Global Multiplier">
				<GlobalMultipliers defaultValue={settings.xpGlobalMultiplier} />

				<Separator />

				<VoteBoost defaultValue={settings.voteBoostedXp} />
			</Section>

			<MultipliersWithTargets
				channels={guild.channels}
				defaultMultipliers={settings.xpMultipliers}
				premium={guild.premium}
				prioritiseMultiplierRoleHierarchy={settings.prioritiseMultiplierRoleHierarchy}
				roles={guild.roles}
			/>
		</Form>
	);
}

export const metadata: Metadata = {
	description: "Configure how much experience each member gains in your server!",
	title: "Multipliers Dashboard",
};
