import { getGuildSettings } from "@/app/guilds/[guildId]/get-guild-data.ts";
import { Separator } from "@/components/Separator.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { cookies } from "next/headers";
import { DownloadLevelingData } from "./01-download-leveling-data.tsx";
import { ResetGuildData } from "./02-reset-guild-data.tsx";

export default async function DangerZone({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { settings } = await getGuildSettings(guildId, token, "danger");

	return (
		<div className="flex w-full flex-col gap-5 px-4 py-4">
			<div className="space-y-2">
				<h2 className="font-semibold text-2xl">Danger Zone</h2>
				<p className="text-white/75">
					Dangerous actions that can have irreversible consequences. Please be careful when using these options.
				</p>
			</div>

			<div className="mb-12 flex flex-col gap-4">
				<Section>
					<Text
						docsPath="/guides/exporting-leveling-leaderboard"
						tooltip="Exports your entire leaderboard into a JSON file you can use for data analysis or to import your leaderboard into a different bot. This does not delete your leaderboard."
					>
						Download the leveling database for your server…
					</Text>

					<DownloadLevelingData guildId={guildId} levelingSystemEnabled={settings.levels} />

					<Separator />

					<Text
						docsPath="/config-commands/config/delete-all"
						tooltip="This button resets your entire Lurkr configuration to default settings. This includes your leaderboard/leveling database."
					>
						Reset all settings, leveling database, member counts, and milestones for your server…
					</Text>

					<p className="text-lg text-red tracking-tighter md:text-xl">
						CAUTION: This action is irreversible! Please make sure you want to do this before proceeding.
					</p>

					<ResetGuildData guildId={guildId} />
				</Section>
			</div>
		</div>
	);
}
