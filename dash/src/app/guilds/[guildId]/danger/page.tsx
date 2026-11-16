import type { Metadata } from "next";
import { getGuildSettings } from "@/app/guilds/[guildId]/settings.ts";
import { DashboardPage } from "@/components/dashboard/DashboardPage.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { Separator } from "@/components/Separator.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { DownloadLevelingData } from "./01-download-leveling-data.tsx";
import { ResetGuildData } from "./02-reset-guild-data.tsx";

export default async function DangerZone({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;
	const { settings } = await getGuildSettings(guildId);

	return (
		<DashboardPage
			description="Dangerous actions that can have irreversible consequences. Please be careful when using these options."
			title="Danger Zone"
		>
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

					<p className="text-lg tracking-tighter text-red md:text-xl">
						CAUTION: This action is irreversible! Please make sure you want to do this before proceeding.
					</p>

					<ResetGuildData guildId={guildId} />
				</Section>
			</div>
		</DashboardPage>
	);
}

export const metadata: Metadata = {
	description: "Dangerous actions regarding your server configuration",
	title: "Danger Dashboard",
};
