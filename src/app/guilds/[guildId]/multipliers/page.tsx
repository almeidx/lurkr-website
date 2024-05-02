import { getGuildSettings } from "@/app/guilds/[guildId]/get-guild-data.ts";
import { VoteBoost } from "@/app/guilds/[guildId]/multipliers/01-vote-boost.tsx";
import { MultipliersWithTargets } from "@/app/guilds/[guildId]/multipliers/03-multipliers-with-targets.tsx";
import { Separator } from "@/components/Separator.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { cookies } from "next/headers";
import { GlobalMultipliers } from "./01-global-multipliers.tsx";
import { update } from "./update.ts";

export default async function Multipliers({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guild, settings } = await getGuildSettings(guildId, token, "multipliers");

	const action = update.bind(null, guildId, settings.premium);

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
