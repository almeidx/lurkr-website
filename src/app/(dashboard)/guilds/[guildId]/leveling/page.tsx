import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getGuildSettings } from "@/app/(dashboard)/guilds/[guildId]/get-guild-data.ts";
import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { Separator } from "@/components/Separator.tsx";
import { MAX_VANITY_LENGTH, MIN_VANITY_LENGTH } from "@/lib/guild-config.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { SignInRequired } from "../sign-in-required.tsx";
import { UnknownGuildOrMissingAccess } from "../unknown-guild.tsx";
import { LevelingChannelMode } from "./01-leveling-channel-mode.tsx";
import { LevelingChannels } from "./02-leveling-channels.tsx";
import { LevelingInThreads } from "./03-leveling-in-threads.tsx";
import { XpGainInterval } from "./04-xp-gain-interval.tsx";
import { XpPerMessageRange } from "./05-xp-per-message-range.tsx";
import { NoLevelingRoles } from "./10-no-leveling-roles.tsx";
import { DisallowedLevelingPrefixes } from "./11-disallowed-leveling-prefixes.tsx";
import { TopLevelingRole } from "./20-top-leveling-role.tsx";
import { NoTopLevelingRoles } from "./21-no-top-leveling-roles.tsx";
import { LevelUpMessageChannel } from "./30-level-up-message-channel.tsx";
import { LevelUpMessage } from "./31-level-up-message.tsx";
import { LevelUpMessageEmbed } from "./32-level-up-message-embed.tsx";
import { LevelUpMessageConditions } from "./33-level-up-message-conditions.tsx";
import { LevelingRoleRewards } from "./40-leveling-role-rewards.tsx";
import { NoRoleRewardsRoles } from "./41-no-role-rewards-roles.tsx";
import { AutomaticallyResetLevels } from "./50-automatically-reset-levels.tsx";
import { DefaultRankCardColor } from "./60-default-rank-card-color.tsx";
import { LeaderboardVanity } from "./70-leaderboard-vanity.tsx";
import { EditLeaderboardVisibility } from "./71-leaderboard-visibility.tsx";
import { update } from "./update.ts";

export default async function Leveling({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;

	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		return <SignInRequired />;
	}

	const guildData = await getGuildSettings(guildId, token, "leveling");

	if (!guildData) {
		return <UnknownGuildOrMissingAccess />;
	}

	const { guild, settings } = guildData;

	const action = update.bind(null, guildId, guild.premium);

	return (
		<Form
			action={action}
			defaultValue={settings.levels}
			description="Reward your member's activity with levels, role rewards and more!"
			settingId="levels"
			title="Leveling"
		>
			<Section
				docsPath="/guides/setting-up-server-leveling#adding-leveling-channels"
				name="Leveling Channels"
				tooltip="Choose in which channels your members can gain experience."
			>
				<LevelingChannelMode defaultValue={settings.xpChannelMode} />

				<LevelingChannels channels={guild.channels} defaultValues={settings.xpChannels} premium={guild.premium} />

				<Separator />

				<LevelingInThreads defaultValue={settings.xpInThreads} />
			</Section>

			<Section name="System Settings" tooltip="Configure how experience points are gained and calculated.">
				<XpGainInterval defaultValue={settings.xpGainInterval} />

				<XpPerMessageRange defaultMax={settings.xpPerMessageMax} defaultMin={settings.xpPerMessageMin} />
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
				docsPath="/guides/leveling-role-rewards#adding-the-daily-top-leveling-role"
				name="All-time Leaderboard Champion"
				tooltip="Choose a role to give to the member that is at rank #1 on the leaderboard. This role is given out daily at 0:00 UTC to members level 10 or above."
			>
				<Text>Award the member with the highest level in your server (updated daily)…</Text>

				<TopLevelingRole defaultValue={settings.topXpRole} roles={guild.roles} />

				<Separator />

				<Text>Set roles that won't be able to get the top leveling role…</Text>

				<NoTopLevelingRoles defaultValues={settings.noTopXpRoles} premium={guild.premium} roles={guild.roles} />
			</Section>

			<Section
				docsPath="/guides/customize-level-up-messages"
				name="Level Up Message"
				tooltip="Choose where the congratulatory level up message is sent to, if at all."
			>
				<LevelUpMessageChannel
					channels={guild.channels}
					defaultCustomChannel={settings.xpAnnounceChannel}
					defaultValue={settings.xpAnnounceChannelType}
				/>

				<LevelUpMessage defaultValue={settings.xpMessage} emojis={guild.emojis} roles={guild.roles} />

				<LevelUpMessageEmbed defaultValue={settings.xpMessageEmbed} emojis={guild.emojis} roles={guild.roles} />

				<LevelUpMessageConditions premium={guild.premium} settings={settings} />
			</Section>

			<Section
				docsPath="/guides/leveling-role-rewards"
				id="role-rewards"
				name="Role Rewards"
				tooltip="Select different roles to reward your members with at different levels. You can reward multiple roles at the same level."
			>
				<LevelingRoleRewards defaultRoleRewards={settings.xpRoleRewards} premium={guild.premium} roles={guild.roles} />

				<Separator />

				<NoRoleRewardsRoles defaultValues={settings.noRoleRewardRoles} premium={guild.premium} roles={guild.roles} />
			</Section>

			<Section
				docsPath="/guides/leveling-automation#automatically-resetting-levels"
				name="Automatically Resetting Levels"
				tooltip="Choose how a members levels are treated after being banned or leaving the server. The selected actions will not be reversible."
			>
				<Text>When do you want to automatically delete a users levels…</Text>

				<AutomaticallyResetLevels defaultValue={settings.autoResetLevels} />
			</Section>

			<Section
				docsPath="/guides/leveling-automation#server-wide-rank-card-colour"
				name="Server-Wide Default Customization"
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

				<Separator />

				<EditLeaderboardVisibility defaultValue={settings.leaderboardVisibility} guildId={guildId} />
			</Section>
		</Form>
	);
}

export const metadata: Metadata = {
	description: "Configure your server's leveling system with Lurkr!",
	title: "Leveling Dashboard",
};
