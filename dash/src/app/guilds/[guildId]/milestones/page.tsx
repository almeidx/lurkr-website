import type { Metadata } from "next";
import { getGuildSettings } from "@/app/guilds/[guildId]/settings.ts";
import { Form } from "@/components/dashboard/Form.tsx";
import { LimitedRoleSelector } from "@/components/dashboard/LimitedRoleSelector.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { SingleChannelSelector } from "@/components/dashboard/SingleChannelSelector.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { Separator } from "@/components/Separator.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { MilestoneInterval } from "./02-milestone-interval.tsx";
import { MilestoneMessage } from "./03-milestone-message.tsx";
import { update } from "./update.ts";

export default async function Milestones({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;
	const { guild, settings } = await getGuildSettings(guildId);
	const action = update.bind(null, guildId, guild.premium);

	return (
		<Form
			action={action}
			defaultValue={settings.storeMilestones}
			description="Configure Lurkr to automatically celebrate a milestone with you!"
			settingId="storeMilestones"
			title="Milestones"
		>
			<Section
				docsPath="/guides/automatically-controlled-member-milestones"
				name="Member Milestones"
				tooltip="This system celebrates when your server has reached a certain number of members (including Bots)."
			>
				<Text
					docsPath="/guides/automatically-controlled-member-milestones#setting-the-milestones-channel"
					tooltip="Choose in which channel the celebratory message will be posted. For best results, choose an announcement channel."
				>
					Set the channel where milestone announcements will be posted…
				</Text>

				<SingleChannelSelector
					channels={guild.channels}
					defaultValue={settings.milestonesChannel}
					inputId="milestones-channel"
					settingId="milestonesChannel"
				/>

				<Separator />

				<MilestoneInterval defaultValue={settings.milestonesInterval} />

				<Separator />

				<MilestoneMessage defaultValue={settings.milestonesMessage} emojis={guild.emojis} roles={guild.roles} />

				<Separator />

				<Text
					docsPath="/guides/automatically-controlled-member-milestones#setting-the-milestones-role"
					tooltip="Choose a role(s) that will be assigned to the member that triggers the milestone. This would be for example the 1000th member to join. They will receive all roles at once."
				>
					Set the milestone reward roles…
				</Text>

				<LimitedRoleSelector
					defaultValues={settings.milestonesRoles}
					inputId="milestone-roles"
					label="Roles"
					limit="milestonesRoles"
					menuPlacement="top"
					premium={guild.premium}
					roles={guild.roles}
					unit="roles"
				/>
			</Section>
		</Form>
	);
}

export const metadata: Metadata = {
	description: "Configure Lurkr to automatically celebrate a milestone with you!",
	title: "Milestones Dashboard",
};
