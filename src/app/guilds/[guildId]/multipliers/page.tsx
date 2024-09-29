import { getGuildSettings } from "@/app/guilds/[guildId]/get-guild-data.ts";
import { Separator } from "@/components/Separator.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { UnknownGuildOrMissingAccess } from "../unknown-guild.tsx";
import { GlobalMultipliers } from "./01-global-multipliers.tsx";
import { VoteBoost } from "./02-vote-boost.tsx";
import { MultipliersWithTargets } from "./10-multipliers-with-targets.tsx";
import { update } from "./update.ts";

export default async function Multipliers({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;

	const token = (await cookies()).get(TOKEN_COOKIE)!.value;
	const guildData = await getGuildSettings(guildId, token, "multipliers");

	if (!guildData) {
		return <UnknownGuildOrMissingAccess />;
	}

	const { guild, settings } = guildData;

	const action = update.bind(null, guildId, guild.premium);

	return (
		<Form title="Multipliers" description="Change who gains how much experience, and where!" action={action}>
			<Section name="Global Multiplier">
				<GlobalMultipliers multipliers={settings.xpMultipliers} />

				<Separator />

				<VoteBoost defaultValue={settings.voteBoostedXp} />
			</Section>

			<MultipliersWithTargets guild={guild} settings={settings} />
		</Form>
	);
}

export const metadata: Metadata = {
	title: "Multipliers Dashboard",
	description: "Configure how much experience each member gains in your server!",
};
