import { Separator } from "@/components/Separator.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
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
		<Form title="Multipliers" action={action}>
			<Section>
				<GlobalMultipliers multipliers={settings.xpMultipliers} />

				<Separator />

				<RoleMultipliers multipliers={settings.xpMultipliers} premium={settings.premium} roles={guild.roles} />

				<RoleMultiplierPriority defaultValue={settings.prioritiseMultiplierRoleHierarchy} />

				<Separator />

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
