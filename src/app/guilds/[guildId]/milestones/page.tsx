import { Separator } from "@/components/Separator.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import type { Guild, GuildSettings } from "@/lib/guild.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { cookies } from "next/headers";
import { MilestonesChannel } from "./01-milestones-channel.tsx";
import { MilestoneInterval } from "./02-milestone-interval.tsx";
import { MilestoneMessage } from "./03-milestone-message.tsx";
import { MilestoneRoles } from "./04-milestone-roles.tsx";
import { update } from "./update.ts";

export default async function Milestones({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guild, settings } = await getData(guildId, token);

	const action = update.bind(null, guildId, settings.premium);

	return (
		<Form
			action={action}
			title="Milestones"
			description="Configure Lurkr to automatically celebrate a milestone with you!"
			defaultValue={settings.storeMilestones}
			settingId="storeMilestones"
		>
			<Section
				name="Member Milestones"
				docsPath="/guides/automatically-controlled-member-milestones"
				tooltip="This system celebrates when your server has reached a certain number of members (including Bots)."
			>
				<Text
					docsPath="/guides/automatically-controlled-member-milestones#setting-the-milestones-channel"
					tooltip="Choose in which channel the celebratory message will be posted. For best results, choose an announcement channel."
				>
					Set the channel where milestone announcements will be posted…
				</Text>

				<MilestonesChannel channels={guild.channels} defaultValue={settings.milestonesChannel} />

				<Separator />

				<MilestoneInterval defaultValue={settings.milestonesInterval} premium={settings.premium} />

				<Separator />

				<MilestoneMessage
					defaultValue={settings.milestonesMessage}
					emojis={guild.emojis}
					premium={settings.premium}
					roles={guild.roles}
				/>

				<Separator />

				<Text
					docsPath="/guides/automatically-controlled-member-milestones#setting-the-milestones-role"
					tooltip="Choose a role(s) that will be assigned to the member that triggers the milestone. This would be for example the 1000th member to join. They will receive all roles at once."
				>
					Set the milestone reward roles…
				</Text>

				<MilestoneRoles defaultValues={settings.milestonesRoles} premium={settings.premium} roles={guild.roles} />
			</Section>
		</Form>
	);
}

async function getData(guildId: Snowflake, token: string) {
	const response = await makeApiRequest(`/guilds/${guildId}`, token, {
		next: {
			tags: [`settings:${guildId}`, `settings:${guildId}:milestones`],
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
