import { getGuildSettings } from "@/app/guilds/[guildId]/get-guild-data.ts";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { cookies } from "next/headers";
import { EmojiListChannel } from "./01-emoji-list-channel.tsx";
import { UpdateEmojiList } from "./02-update-emoji-list.tsx";
import { update } from "./update.ts";

export default async function Emojis({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guild, settings } = await getGuildSettings(guildId, token, "emojis");

	const action = update.bind(null, guildId);

	return (
		<Form
			action={action}
			title="Emoji List"
			description="Set up a list of all of your server emojis and forget about it as it updates itself!"
			defaultValue={settings.emojiList}
			settingId="emojiList"
		>
			<Section>
				<Text
					docsPath="/guides/automatically-controlled-emoji-list#setting-the-channel"
					tooltip="Select a channel where all emoji that have been uploaded to the server will be listed. The channel will automatically remove any other messages sent to it from other members, and it will automatically update the list when emojis are added, removed, or changed."
				>
					Set the channel where the emoji list will be posted…
				</Text>

				<EmojiListChannel channels={guild.channels} defaultValue={settings.emojiListChannel} />

				<UpdateEmojiList />
			</Section>
		</Form>
	);
}
