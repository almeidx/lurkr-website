import { Separator } from "@/components/Separator.tsx";
import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import type { Guild, GuildSettings } from "@/lib/guild.ts";
import { API_URL, TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { cookies } from "next/headers";
import { OnJoinRoles } from "./01-on-join-roles.tsx";
import { OnJoinRolesDelay } from "./02-on-join-roles-delay.tsx";
import { OnJoinRolesForBadges } from "./03-on-join-roles-for-badges.tsx";
import { MentionCooldownRoles } from "./04-mention-cooldown-roles.tsx";
import { MentionCooldown } from "./05-mention-cooldown.tsx";
import { update } from "./update.ts";

export default async function Roles({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guild, settings } = await getData(guildId, token);

	const action = update.bind(null, guildId, settings.premium);

	return (
		<Form title="Role Management" action={action}>
			<Section name="On Join Roles" docsPath="/guides/automatically-added-roles-with-timeout">
				<span className="inline-block gap-2 text-xl tracking-tight text-white/75">
					Automatically assign <span className="font-semibold text-white">every</span> user who joins a role(s)…
				</span>

				<OnJoinRoles defaultValues={settings.autoRole} premium={settings.premium} roles={guild.roles} />

				<Separator />

				<Text docsPath="/guides/automatically-added-roles-with-timeout#setting-your-timeout">
					Set the time between joining and getting the role(s)…
				</Text>

				<OnJoinRolesDelay defaultValue={settings.autoRoleTimeout} premium={settings.premium} />

				<Separator />

				<OnJoinRolesForBadges defaultValues={settings.autoRoleFlags} premium={settings.premium} roles={guild.roles} />
			</Section>

			<Section name="Role Mention Cooldown" docsPath="/guides/automatic-role-mention-cooldown">
				<Text>Set which role(s) should get a cooldown when pinged…</Text>

				<MentionCooldownRoles
					defaultValues={settings.mentionCooldownRoles}
					premium={settings.premium}
					roles={guild.roles}
				/>

				<Separator />

				<Text docsPath="/guides/automatic-role-mention-cooldown#setting-up-the-cooldown-time">
					Set the time between pings for the role(s)…
				</Text>

				<MentionCooldown defaultValue={settings.mentionCooldown} premium={settings.premium} />
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
			tags: ["settings", "settings-roles"],
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
