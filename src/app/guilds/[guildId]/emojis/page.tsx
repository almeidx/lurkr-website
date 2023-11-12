import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import type { Guild, GuildSettings } from "@/lib/guild.ts";
import { API_URL, TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { cookies } from "next/headers";
import { EmojiListChannel } from "./01-emoji-list-channel.tsx";
import { UpdateEmojiList } from "./02-update-emoji-list.tsx";
import { update } from "./update.ts";

export default async function Emojis({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guild, settings } = await getData(guildId, token);

	const action = update.bind(null, guildId);

	return (
		<Form action={action} title="Emoji List" defaultValue={settings.emojiList} settingId="emojiList">
			<Section>
				<Text docsPath="/guides/automatically-controlled-emoji-list#setting-the-channel">
					Set the channel where the emoji list will be posted…
				</Text>

				<EmojiListChannel channels={guild.channels} defaultValue={settings.emojiListChannel} />

				<UpdateEmojiList />
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
			tags: ["settings", "settings-emojis"],
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
