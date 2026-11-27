import type { Metadata } from "next";
import { getGuildSettings } from "@/app/guilds/[guildId]/settings.ts";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { SingleChannelSelector } from "@/components/dashboard/SingleChannelSelector.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { update } from "./update.ts";

export default async function Emojis({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;
	const { guild, settings } = await getGuildSettings(guildId);
	const action = update.bind(null, guildId);

	return (
		<Form
			action={action}
			defaultValue={settings.emojiList}
			description="Set up a list of all of your server emojis and forget about it as it updates itself!"
			settingId="emojiList"
			title="Emoji List"
		>
			<Section>
				<Text
					docsPath="/guides/automatically-controlled-emoji-list#setting-the-channel"
					tooltip="Select a channel where all emoji that have been uploaded to the server will be listed. The channel will automatically remove any other messages sent to it from other members, and it will automatically update the list when emojis are added, removed, or changed."
				>
					Set the channel where the emoji list will be posted…
				</Text>

				<SingleChannelSelector
					channels={guild.channels}
					defaultValue={settings.emojiListChannel}
					inputId="emoji-list-channel"
					settingId="emojiListChannel"
				/>
			</Section>
		</Form>
	);
}

export const metadata: Metadata = {
	description: "Configure Lurkr to automatically update a list of all of your server emojis!",
	title: "Emojis Dashboard",
};
