import { getGuildSettings } from "@/app/guilds/[guildId]/get-guild-data.ts";
import { Separator } from "@/components/Separator.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { cookies } from "next/headers";
import { StoreMemberCountData } from "./01-store-member-count-data.tsx";
import { AutomaticallyPublishChannels } from "./02-automatically-publish-channels.tsx";
import { update } from "./update.ts";

export default async function Miscellaneous({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guild, settings } = await getGuildSettings(guildId, token, "miscellaneous");

	const action = update.bind(null, guildId, settings.premium);

	return (
		<Form
			title="Miscellaneous"
			description="Configure miscellaneous settings that don't fit anywhere else."
			action={action}
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
					defaultValues={settings.autoPublishChannels}
					channels={guild.channels}
					premium={settings.premium}
				/>
			</Section>
		</Form>
	);
}
