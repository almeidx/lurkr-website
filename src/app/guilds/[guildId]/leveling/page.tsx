import { getGuildSettings } from "@/app/guilds/[guildId]/get-guild-data.ts";
import { Separator } from "@/components/Separator.tsx";
import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { MAX_VANITY_LENGTH, MIN_VANITY_LENGTH } from "@/lib/guild-config.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { UnknownGuildOrMissingAccess } from "../unknown-guild.tsx";
import { LevelingChannelMode } from "./01-leveling-channel-mode.tsx";
import { LevelingChannels } from "./02-leveling-channels.tsx";
import { LevelingInThreads } from "./03-leveling-in-threads.tsx";
import { NoLevelingRoles } from "./10-no-leveling-roles.tsx";
import { DisallowedLevelingPrefixes } from "./11-disallowed-leveling-prefixes.tsx";
import { TopLevelingRole } from "./20-top-leveling-role.tsx";
import { NoTopLevelingRoles } from "./21-no-top-leveling-roles.tsx";
import { LevelUpMessageChannel } from "./30-level-up-message-channel.tsx";
import { LevelUpMessage } from "./31-level-up-message.tsx";
import { LevelUpMessageConditions } from "./32-level-up-message-conditions.tsx";
import { LevelingRoleRewards } from "./40-leveling-role-rewards.tsx";
import { StackRoleRewards } from "./41-stack-role-rewards.tsx";
import { NoRoleRewardsRoles } from "./42-no-role-rewards-roles.tsx";
import { AutomaticallyResetLevels } from "./50-automatically-reset-levels.tsx";
import { DefaultRankCardColor } from "./60-default-rank-card-color.tsx";
import { LeaderboardVanity } from "./70-leaderboard-vanity.tsx";
import { update } from "./update.ts";

export default async function Leveling({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const guildData = await getGuildSettings(guildId, token, "leveling");

	if (!guildData) {
		return <UnknownGuildOrMissingAccess />;
	}

	const { guild, settings } = guildData;

	const action = update.bind(null, guildId, guild.premium);

	return (
		<Form
			action={action}
			title="Leveling"
			description="Reward your member's activity with levels, role rewards and more!"
			defaultValue={settings.levels}
			settingId="levels"
		>
			<Section
				name="Leveling Channels"
				docsPath="/guides/setting-up-server-leveling#adding-leveling-channels"
				tooltip="Choose in which channels your members can gain experience."
			>
				<LevelingChannelMode defaultValue={settings.xpChannelMode} />

				<LevelingChannels channels={guild.channels} defaultValues={settings.xpChannels} premium={guild.premium} />

				<Separator />

				<LevelingInThreads defaultValue={settings.xpInThreads} />
			</Section>

			<Section name="Leveling Blacklists">
				<Text
					docsPath="/guides/leveling-role-rewards#no-leveling-roles"
					tooltip="Choose if certain roles should not be able to gain any experience. This setting is not affected by role hierarchy."
				>
					Set roles that won't be able to gain any levels…
				</Text>

				<NoLevelingRoles defaultValues={settings.noXpRoles} premium={guild.premium} roles={guild.roles} />

				<Separator />

				<Text
					docsPath="/guides/leveling-automation#ignored-bot-prefixes"
					tooltip="Choose if messages that start with a certain character should not be able to gain any experience. This is most useful if members use bot's text-commands in an experience-enabled channel frequently."
				>
					Set bot prefixes to be ignored if the message starts with them…
				</Text>

				<DisallowedLevelingPrefixes defaultValues={settings.xpDisallowedPrefixes} premium={guild.premium} />
			</Section>

			<Section
				name="All-time Leaderboard Champion"
				docsPath="/guides/leveling-role-rewards#adding-the-daily-top-leveling-role"
				tooltip="Choose a role to give to the member that is at rank #1 on the leaderboard. This role is given out daily at 0:00 UTC to members level 10 or above."
			>
				<Text>Award the member with the highest level in your server (updated daily)…</Text>

				<TopLevelingRole defaultValue={settings.topXpRole} roles={guild.roles} />

				<Separator />

				<Text>Set roles that won't be able to get the top leveling role…</Text>

				<NoTopLevelingRoles defaultValues={settings.noTopXpRoles} premium={guild.premium} roles={guild.roles} />
			</Section>

			<Section
				name="Level Up Message"
				docsPath="/guides/customize-level-up-messages"
				tooltip="Choose where the congratulatory level up message is sent to, if at all."
			>
				<LevelUpMessageChannel
					channels={guild.channels}
					defaultValue={settings.xpAnnounceChannelType}
					defaultCustomChannel={settings.xpAnnounceChannel}
				/>

				<LevelUpMessage
					defaultValue={settings.xpMessage}
					emojis={guild.emojis}
					premium={guild.premium}
					roles={guild.roles}
				/>

				<LevelUpMessageConditions settings={settings} premium={guild.premium} />
			</Section>

			<Section
				name="Role Rewards"
				docsPath="/guides/leveling-role-rewards"
				tooltip="Select different roles to reward your members with at different levels. You can reward multiple roles at the same level."
			>
				<LevelingRoleRewards defaultRoleRewards={settings.xpRoleRewards} premium={guild.premium} roles={guild.roles} />

				<Separator />

				<Text>What to do with previous rewards…</Text>

				<StackRoleRewards defaultValue={settings.stackXpRoles} />

				<Separator />

				<NoRoleRewardsRoles defaultValues={settings.noRoleRewardRoles} premium={guild.premium} roles={guild.roles} />
			</Section>

			<Section
				name="Automatically Resetting Levels"
				docsPath="/guides/leveling-automation#automatically-resetting-levels"
				tooltip="Choose how a members levels are treated after being banned or leaving the server. The selected actions will not be reversible."
			>
				<Text>When do you want to automatically delete a users levels…</Text>

				<AutomaticallyResetLevels defaultValue={settings.autoResetLevels} />
			</Section>

			<Section
				name="Server-Wide Default Customization"
				docsPath="/guides/leveling-automation#server-wide-rank-card-colour"
				tooltip="Choose what colour will be displayed as the progress bar in the rand card image. If a member has set a personal rank card colour, this setting will be ignored for that member."
			>
				<Text>Set which colour the rank progress bar should be for your server members…</Text>

				<DefaultRankCardColor defaultAccentColour={settings.accentColour} defaultAccentType={settings.accentType} />
			</Section>

			<Section name="Web Leaderboard">
				<div className="mt-2 flex items-center">
					<Label sub={`Between ${MIN_VANITY_LENGTH}-${MAX_VANITY_LENGTH} alphanumeric characters`}>
						Set a vanity for your server's leaderboard URL…
					</Label>

					<DocsBubble
						path="/guides/setting-a-leaderboard-vanity-url"
						tooltip="A vanity that can be used to access your servers web leaderboard, instead of the standard server ID"
					/>
				</div>

				<LeaderboardVanity defaultValue={settings.vanity} />
			</Section>
		</Form>
	);
}

export const metadata: Metadata = {
	title: "Leveling Dashboard",
	description: "Configure your server's leveling system with Lurkr!",
};
