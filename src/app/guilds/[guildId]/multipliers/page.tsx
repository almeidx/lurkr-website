import { Separator } from "@/components/Separator.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import type { Guild, GuildSettings } from "@/lib/guild.ts";
import { API_URL, TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { cookies } from "next/headers";
import { GlobalMultipliers } from "./01-global-multipliers.tsx";
import { RoleMultipliers } from "./02-role-multipliers.tsx";
import { RoleMultiplierPriority } from "./03-role-multiplier-priority.tsx";
import { ChannelMultipliers } from "./04-channel-multipliers.tsx";
import { update } from "./update.ts";

export default async function Multipliers({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guild, settings } = await getData(guildId, token);

	const action = update.bind(null, guildId, settings.premium);

	return (
		<Form title="Multipliers" description="Change who gains how much XP, and where!" action={action}>
			<Section name="Global Multiplier">
				<GlobalMultipliers multipliers={settings.xpMultipliers} />
			</Section>

			<Section name="Role Multipliers">
				<RoleMultipliers multipliers={settings.xpMultipliers} premium={settings.premium} roles={guild.roles} />

				<Separator />

				<Text docsPath="/guides/setting-up-leveling-multipliers#changing-role-multiplier-hierarchy">
					When more than one role multiplier applies, use the one with…
				</Text>

				<RoleMultiplierPriority defaultValue={settings.prioritiseMultiplierRoleHierarchy} />
			</Section>

			<Section name="Channel Multipliers">
				<ChannelMultipliers channels={guild.channels} multipliers={settings.xpMultipliers} premium={settings.premium} />
			</Section>
		</Form>
	);
}

async function getData(guildId: Snowflake, token: string) {
	const response = await fetch(`${API_URL}/guilds/${guildId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		next: {
			tags: ["settings", "settings-multipliers"],
		},
	});

	if (!response.ok) {
		throw new Error("Failed to get guild information");
	}

	return response.json() as Promise<GetGuildResponse>;
}

interface GetGuildResponse {
	guild: Guild;
	settings: GuildSettings;
}
