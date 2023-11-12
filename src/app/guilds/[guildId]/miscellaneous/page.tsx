import { Separator } from "@/components/Separator.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import type { Guild, GuildSettings } from "@/lib/guild.ts";
import { API_URL, TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { cookies } from "next/headers";
import { StoreMemberCountData } from "./01-store-member-count-data.tsx";
import { AutomaticallyPublishChannels } from "./02-automatically-publish-channels.tsx";
import { update } from "./update.ts";

export default async function Miscellaneous({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guild, settings } = await getData(guildId, token);

	const action = update.bind(null, guildId, settings.premium);

	return (
		<Form title="Miscellaneous" action={action}>
			<Section>
				<StoreMemberCountData defaultValue={settings.storeCounts} />

				<Separator />

				<Text docsPath="/guides/automatically-published-announcements">
					Set announcement channels in which posts are auto-published…
				</Text>

				<AutomaticallyPublishChannels
					defaultValues={settings.autoPublishChannels}
					channels={guild.channels}
					premium={settings.premium}
				/>
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
			tags: ["settings", "settings-miscellaneous"],
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
