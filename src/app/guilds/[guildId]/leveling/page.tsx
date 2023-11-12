import { Separator } from "@/components/Separator.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import type { Guild, GuildSettings } from "@/lib/guild.ts";
import { API_URL, TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { cookies } from "next/headers";
import { LevelingChannelMode } from "./01-leveling-channel-mode.tsx";
import { LevelingChannels } from "./02-leveling-channels.tsx";
import { LevelingInThreads } from "./03-leveling-in-threads.tsx";
import { NoLevelingRoles } from "./04-no-leveling-roles.tsx";
import { DisallowedLevelingPrefixes } from "./05-disallowed-leveling-prefixes.tsx";
import { TopLevelingRole } from "./06-top-leveling-role.tsx";
import { LevelUpMessageChannel } from "./07-level-up-message-channel.tsx";
import { LevelUpMessage } from "./08-level-up-message.tsx";
import { LevelUpMessageConditions } from "./09-level-up-message-conditions.tsx";
import { LevelingRoleRewards } from "./10-leveling-role-rewards.tsx";
import { StackRoleRewards } from "./11-stack-role-rewards.tsx";
import { NoRoleRewardsRoles } from "./12-no-role-rewards-roles.tsx";
import { AutomaticallyResetLevels } from "./13-automatically-reset-levels.tsx";
import { DefaultRankCardColor } from "./14-default-rank-card-color.tsx";
import { update } from "./update.ts";

export default async function Leveling({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guild, settings } = await getData(guildId, token);

	const action = update.bind(null, guildId, settings.premium);

	return (
		<Form action={action} title="Leveling" defaultValue={settings.levels} settingId="levels">
			<Section name="Leveling Channels" docsPath="/guides/setting-up-server-leveling#adding-leveling-channels">
				<LevelingChannelMode defaultValue={settings.xpChannelMode} />

				<LevelingChannels channels={guild.channels} defaultValues={settings.xpChannels} premium={settings.premium} />

				<Separator />

				<LevelingInThreads defaultValue={settings.xpInThreads} />
			</Section>

			<Section name="Leveling Blacklists">
				<Text docsPath="/guides/setting-up-server-leveling#no-leveling-roles">
					Set roles that won’t be able to gain any levels…
				</Text>

				<NoLevelingRoles defaultValues={settings.noXpRoles} premium={settings.premium} roles={guild.roles} />

				<Separator />

				<Text docsPath="/guides/setting-up-server-leveling#ignored-bot-prefixes">
					Set bot prefixes to be ignored if the message starts with them…
				</Text>

				<DisallowedLevelingPrefixes defaultValues={settings.xpDisallowedPrefixes} />
			</Section>

			<Section
				name="All-time Leaderboard Champion"
				docsPath="/guides/setting-up-server-leveling#adding-the-daily-top-leveling-role"
			>
				<TopLevelingRole defaultValue={settings.topXpRole} roles={guild.roles} />
			</Section>

			<Section name="Level Up Message" docsPath="/guides/setting-up-server-leveling#customizing-the-level-up-message">
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

			<Section name="Role Rewards" docsPath="/guides/setting-up-server-leveling#adding-leveling-role-rewards">
				<LevelingRoleRewards
					defaultRoleRewards={settings.xpRoleRewards}
					premium={settings.premium}
					roles={guild.roles}
				/>

				<Separator />

				<StackRoleRewards defaultValue={settings.stackXpRoles} />

				<Separator />

				<NoRoleRewardsRoles defaultValues={settings.noRoleRewardRoles} premium={settings.premium} roles={guild.roles} />
			</Section>

			<Section name="Automatically Resetting Levels">
				<Text>When do you want to automatically delete a users levels…</Text>

				<AutomaticallyResetLevels defaultValue={settings.autoResetLevels} />
			</Section>

			<Section
				name="Server-Wide Default Rank Card Colour"
				docsPath="/guides/setting-up-server-leveling#server-wide-rank-card-colour"
			>
				<Text>Set which colour the rank progress bar should be for your server members…</Text>

				<DefaultRankCardColor defaultAccentColour={settings.accentColour} defaultAccentType={settings.accentType} />
			</Section>
		</Form>
	);
}

async function getData(guildId: Snowflake, token: string) {
	const response = await fetch(`${API_URL}/guilds/${guildId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		next: {
			tags: ["settings", "settings-leveling"],
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
