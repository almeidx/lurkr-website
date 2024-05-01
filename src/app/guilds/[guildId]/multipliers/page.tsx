import { getGuildSettings } from "@/app/guilds/[guildId]/get-guild-data.ts";
import { VoteBoost } from "@/app/guilds/[guildId]/multipliers/01-vote-boost.tsx";
import { Separator } from "@/components/Separator.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { cookies } from "next/headers";
import { GlobalMultipliers } from "./01-global-multipliers.tsx";
import { RoleMultipliers } from "./02-role-multipliers.tsx";
import { RoleMultiplierPriority } from "./03-role-multiplier-priority.tsx";
import { ChannelMultipliers } from "./04-channel-multipliers.tsx";
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

			<Section name="Role Multipliers">
				<Text
					htmlFor="role-selector"
					docsPath="/guides/setting-up-leveling-multipliers#setting-role-multipliers"
					tooltip="Choose certain roles that, if a member has at least one of, will multiply with the global multiplier. The end multiplier is calculated by this formula: Global Multiplier x Channel Multiplier x Role Multiplier."
				>
					Setup role multipliers that only apply to members in those roles…
				</Text>

				<RoleMultipliers multipliers={settings.xpMultipliers} premium={settings.premium} roles={guild.roles} />

				<Separator />

				<Text
					docsPath="/guides/setting-up-leveling-multipliers#changing-role-multiplier-hierarchy"
					tooltip="Changes the behaviour when more than one assigned role has different multipliers attached. Either the highest role as it appears in the server settings menu is chosen, or the role with the highest multiplier."
				>
					When more than one role multiplier applies, use the one with…
				</Text>

				<RoleMultiplierPriority defaultValue={settings.prioritiseMultiplierRoleHierarchy} />
			</Section>

			<Section name="Channel Multipliers">
				<Text
					htmlFor="channel-selector"
					docsPath="/guides/setting-up-leveling-multipliers#setting-channel-multipliers"
					tooltip="Choose certain channels that, if a member is chatting in one of those channels, will multiply with the global multiplier. The end multiplier is calculated by this formula: Global Multiplier x Channel Multiplier x Role Multiplier."
				>
					Setup channel multipliers that only apply to members chatting in those channels…
				</Text>

				<ChannelMultipliers channels={guild.channels} multipliers={settings.xpMultipliers} premium={settings.premium} />
			</Section>
		</Form>
	);
}
