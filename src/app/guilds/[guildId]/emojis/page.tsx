import { getGuildSettings } from "@/app/guilds/[guildId]/get-guild-data.ts";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { UnknownGuildOrMissingAccess } from "../unknown-guild.tsx";
import { EmojiListChannel } from "./01-emoji-list-channel.tsx";
import { UpdateEmojiList } from "./02-update-emoji-list.tsx";
import { update } from "./update.ts";

export default async function Emojis({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;

	const token = (await cookies()).get(TOKEN_COOKIE)!.value;
	const guildData = await getGuildSettings(guildId, token, "emojis");

	if (!guildData) {
		return <UnknownGuildOrMissingAccess />;
	}

	const { guild, settings } = guildData;

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

export const metadata: Metadata = {
	title: "Emojis Dashboard",
	description: "Configure Lurkr to automatically update a list of all of your server emojis!",
};
