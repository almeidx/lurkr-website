import type { Guild, GuildSettings } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

export async function getGuildSettings(guildId: Snowflake, token: string, pageTagName: string) {
	const response = await makeApiRequest(`/guilds/${guildId}`, token, {
		next: {
			revalidate: 0,
			tags: [`settings:${guildId}`, `settings:${guildId}:${pageTagName}`],
		},
	});

	if (!response.ok) {
		return null;
	}

	return response.json() as Promise<GetGuildResponse>;
}

interface GetGuildResponse {
	guild: Guild;
	settings: GuildSettings;
}
