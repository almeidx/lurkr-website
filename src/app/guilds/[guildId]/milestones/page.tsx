import { getGuildSettings } from "@/app/guilds/[guildId]/get-guild-data.ts";
import { Separator } from "@/components/Separator.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { UnknownGuildOrMissingAccess } from "../unknown-guild.tsx";
import { MilestonesChannel } from "./01-milestones-channel.tsx";
import { MilestoneInterval } from "./02-milestone-interval.tsx";
import { MilestoneMessage } from "./03-milestone-message.tsx";
import { MilestoneRoles } from "./04-milestone-roles.tsx";
import { update } from "./update.ts";

export default async function Milestones({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;

	const token = (await cookies()).get(TOKEN_COOKIE)!.value;
	const guildData = await getGuildSettings(guildId, token, "milestones");

	if (!guildData) {
		return <UnknownGuildOrMissingAccess />;
	}

	const { guild, settings } = guildData;

	const action = update.bind(null, guildId, guild.premium);

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

				<MilestoneInterval defaultValue={settings.milestonesInterval} premium={guild.premium} />

				<Separator />

				<MilestoneMessage
					defaultValue={settings.milestonesMessage}
					emojis={guild.emojis}
					premium={guild.premium}
					roles={guild.roles}
				/>

				<Separator />

				<Text
					docsPath="/guides/automatically-controlled-member-milestones#setting-the-milestones-role"
					tooltip="Choose a role(s) that will be assigned to the member that triggers the milestone. This would be for example the 1000th member to join. They will receive all roles at once."
				>
					Set the milestone reward roles…
				</Text>

				<MilestoneRoles defaultValues={settings.milestonesRoles} premium={guild.premium} roles={guild.roles} />
			</Section>
		</Form>
	);
}

export const metadata: Metadata = {
	title: "Milestones Dashboard",
	description: "Configure Lurkr to automatically celebrate a milestone with you!",
};
