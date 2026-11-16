import type { Metadata } from "next";
import { getGuildSettings } from "@/app/guilds/[guildId]/settings.ts";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { Separator } from "@/components/Separator.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { StoreMemberCountData } from "./01-store-member-count-data.tsx";
import { AutomaticallyPublishChannels } from "./02-automatically-publish-channels.tsx";
import { update } from "./update.ts";

export default async function Miscellaneous({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;
	const { guild, settings } = await getGuildSettings(guildId);
	const action = update.bind(null, guildId, guild.premium);

	return (
		<Form
			action={action}
			description="Configure miscellaneous settings that don't fit anywhere else."
			title="Miscellaneous"
		>
			<Section>
				<StoreMemberCountData defaultValue={settings.storeCounts} />

				<Separator />

				<Text
					docsPath="/guides/automatically-published-announcements"
					tooltip="Choose which announcement channels should have all of the messages posted to it automatically published."
				>
					Set announcement channels in which posts are auto-published…
				</Text>

				<AutomaticallyPublishChannels
					channels={guild.channels}
					defaultValues={settings.autoPublishChannels}
					premium={guild.premium}
				/>
			</Section>
		</Form>
	);
}

export const metadata: Metadata = {
	description: "Configure miscellaneous Lurkr settings",
	title: "Miscellaneous Dashboard",
};
