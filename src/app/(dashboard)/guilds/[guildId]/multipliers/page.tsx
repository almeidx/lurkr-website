import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getGuildSettings } from "@/app/(dashboard)/guilds/[guildId]/get-guild-data.ts";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Separator } from "@/components/Separator.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { SignInRequired } from "../sign-in-required.tsx";
import { UnknownGuildOrMissingAccess } from "../unknown-guild.tsx";
import { GlobalMultipliers } from "./01-global-multipliers.tsx";
import { VoteBoost } from "./02-vote-boost.tsx";
import { MultipliersWithTargets } from "./10-multipliers-with-targets.tsx";
import { update } from "./update.ts";

export default async function Multipliers({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;

	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		return <SignInRequired />;
	}

	const guildData = await getGuildSettings(guildId, token, "multipliers");

	if (!guildData) {
		return <UnknownGuildOrMissingAccess />;
	}

	const { guild, settings } = guildData;

	const action = update.bind(null, guildId, guild.premium);

	return (
		<Form action={action} description="Change who gains how much experience, and where!" title="Multipliers">
			<Section id="global-multiplier" name="Global Multiplier">
				<GlobalMultipliers multipliers={settings.xpMultipliers} />

				<Separator />

				<VoteBoost defaultValue={settings.voteBoostedXp} />
			</Section>

			<MultipliersWithTargets guild={guild} settings={settings} />
		</Form>
	);
}

export const metadata: Metadata = {
	description: "Configure how much experience each member gains in your server!",
	title: "Multipliers Dashboard",
};
