import { NoTopLevelingRoles } from "@/app/guilds/[guildId]/leveling/07-no-top-leveling-roles.tsx";
import { Separator } from "@/components/Separator.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import type { Guild, GuildSettings } from "@/lib/guild.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { cookies } from "next/headers";
import { LevelingChannelMode } from "./01-leveling-channel-mode.tsx";
import { LevelingChannels } from "./02-leveling-channels.tsx";
import { LevelingInThreads } from "./03-leveling-in-threads.tsx";
import { NoLevelingRoles } from "./04-no-leveling-roles.tsx";
import { DisallowedLevelingPrefixes } from "./05-disallowed-leveling-prefixes.tsx";
import { TopLevelingRole } from "./06-top-leveling-role.tsx";
import { LevelUpMessageChannel } from "./08-level-up-message-channel.tsx";
import { LevelUpMessage } from "./09-level-up-message.tsx";
import { LevelUpMessageConditions } from "./10-level-up-message-conditions.tsx";
import { LevelingRoleRewards } from "./11-leveling-role-rewards.tsx";
import { StackRoleRewards } from "./12-stack-role-rewards.tsx";
import { NoRoleRewardsRoles } from "./13-no-role-rewards-roles.tsx";
import { AutomaticallyResetLevels } from "./14-automatically-reset-levels.tsx";
import { DefaultRankCardColor } from "./15-default-rank-card-color.tsx";
import { update } from "./update.ts";

export default async function Leveling({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guild, settings } = await getData(guildId, token);

	const action = update.bind(null, guildId, settings.premium);

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

				<LevelingChannels channels={guild.channels} defaultValues={settings.xpChannels} premium={settings.premium} />

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

				<NoLevelingRoles defaultValues={settings.noXpRoles} premium={settings.premium} roles={guild.roles} />

				<Separator />

				<Text
					docsPath="/guides/leveling-automation#ignored-bot-prefixes"
					tooltip="Choose if messages that start with a certain character should not be able to gain any experience. This is most useful if members use bot's text-commands in an experience-enabled channel frequently."
				>
					Set bot prefixes to be ignored if the message starts with them…
				</Text>

				<DisallowedLevelingPrefixes defaultValues={settings.xpDisallowedPrefixes} />
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

				<NoTopLevelingRoles defaultValues={settings.noTopXpRoles} premium={settings.premium} roles={guild.roles} />
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
					premium={settings.premium}
					roles={guild.roles}
				/>

				<LevelUpMessageConditions settings={settings} />
			</Section>

			<Section
				name="Role Rewards"
				docsPath="/guides/leveling-role-rewards"
				tooltip="Select different roles to reward your members with at different levels. You can reward multiple roles at the same level."
			>
				<LevelingRoleRewards
					defaultRoleRewards={settings.xpRoleRewards}
					premium={settings.premium}
					roles={guild.roles}
				/>

				<Separator />

				<Text>What to do with previous rewards…</Text>

				<StackRoleRewards defaultValue={settings.stackXpRoles} />

				<Separator />

				<NoRoleRewardsRoles defaultValues={settings.noRoleRewardRoles} premium={settings.premium} roles={guild.roles} />
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
				name="Server-Wide Default Rank Card Colour"
				docsPath="/guides/leveling-automation#server-wide-rank-card-colour"
				tooltip="Choose what colour will be displayed as the progress bar in the rand card image. If a member has set a personal rank card colour, this setting will be ignored for that member."
			>
				<Text>Set which colour the rank progress bar should be for your server members…</Text>

				<DefaultRankCardColor defaultAccentColour={settings.accentColour} defaultAccentType={settings.accentType} />
			</Section>
		</Form>
	);
}

async function getData(guildId: Snowflake, token: string) {
	const response = await makeApiRequest(`/guilds/${guildId}`, token, {
		next: {
			tags: [`settings:${guildId}`, `settings:${guildId}:leveling`],
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
