import type { Metadata } from "next";
import { getGuildSettings } from "@/app/guilds/[guildId]/settings.ts";
import { Form } from "@/components/dashboard/Form.tsx";
import { LimitedRoleSelector } from "@/components/dashboard/LimitedRoleSelector.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { Separator } from "@/components/Separator.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { OnJoinRolesDelay } from "./02-on-join-roles-delay.tsx";
import { OnJoinRolesForBadges } from "./10-on-join-roles-for-badges.tsx";
import { MentionCooldownRoles } from "./20-mention-cooldown-roles.tsx";
import { MentionCooldown } from "./21-mention-cooldown.tsx";
import { MentionCooldownWarnings } from "./22-mention-cooldown-warnings.tsx";
import { MentionCooldownEditsProvider } from "./mention-cooldown-context.tsx";
import { update } from "./update.ts";

export default async function Roles({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;
	const { guild, settings } = await getGuildSettings(guildId);
	const action = update.bind(null, guildId, guild.premium);

	return (
		<Form
			action={action}
			description="Automatically assign roles to users and avoid role mentions spam!"
			title="Role Management"
		>
			<Section
				docsPath="/guides/automatically-added-roles-with-timeout"
				name="On Join Roles"
				tooltip="Select roles that will be assigned to every member who joins your server."
			>
				<Text>
					Automatically assign <span className="font-semibold text-white">every</span> user who joins a role(s)…
				</Text>

				<LimitedRoleSelector
					defaultValues={settings.autoRole}
					inputId="on-join-roles"
					label="Roles"
					limit="autoRole"
					premium={guild.premium}
					roles={guild.roles}
				/>

				<Separator />

				<Text
					docsPath="/guides/automatically-added-roles-with-timeout#setting-your-timeout"
					tooltip="This can be changed to wait a certain amount of time before giving the role, to make sure the Discord Verification Level settings are not bypassed. Immediately assigning a role will bypass the 10 minute timer for a new member."
				>
					Set the time between joining and getting the role(s)…
				</Text>

				<OnJoinRolesDelay defaultValue={settings.autoRoleTimeout} />
			</Section>

			<Section name="On Join Roles for Badges">
				<Text
					docsPath="/guides/automatically-added-roles-with-timeout#setting-badge-specific-on-join-roles"
					htmlFor="role-selector"
					tooltip="Select roles that will be assigned to every new member who joins, depending on if they have a Discord Badge. If you have set a time between joining and getting the roles, this will also wait the set amount of time before assigning."
				>
					Set roles to be Discord badge-specific…
				</Text>

				<OnJoinRolesForBadges defaultValues={settings.autoRoleFlags} roles={guild.roles} />
			</Section>

			<Section
				docsPath="/guides/automatic-role-mention-cooldown"
				name="Role Mention Cooldown"
				tooltip="Choose if certain roles should be mentionable by regular members, and for how long they should not be mentionable, after having been mentioned once. This is to avoid spam pings for Moderators or Admins."
			>
				<MentionCooldownEditsProvider>
					<Text>Set which role(s) should get a cooldown when mentioned…</Text>

					<MentionCooldownRoles defaultValues={settings.mentionCooldownRoles} roles={guild.roles} />

					<Separator />

					<Text
						docsPath="/guides/automatic-role-mention-cooldown#setting-up-the-cooldown-time"
						tooltip="Choose the time it takes to mention the role(s) again after they were first mentioned."
					>
						Set how long the roles will be unmentionable for…
					</Text>

					<MentionCooldown defaultValue={settings.mentionCooldown} premium={guild.premium} />

					<MentionCooldownWarnings
						mentionedRoleIds={guild.mentionedRoleIds}
						roles={guild.roles}
						savedRoleIds={settings.mentionCooldownRoles}
					/>
				</MentionCooldownEditsProvider>
			</Section>
		</Form>
	);
}

export const metadata: Metadata = {
	description: "Automatically assign roles to users and avoid role mentions spam!",
	title: "Roles Dashboard",
};
