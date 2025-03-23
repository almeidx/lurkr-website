import { getGuildSettings } from "@/app/(dashboard)/guilds/[guildId]/get-guild-data.ts";
import { Separator } from "@/components/Separator.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SignInRequired } from "../sign-in-required.tsx";
import { UnknownGuildOrMissingAccess } from "../unknown-guild.tsx";
import { DownloadLevelingData } from "./01-download-leveling-data.tsx";
import { ResetGuildData } from "./02-reset-guild-data.tsx";

export default async function DangerZone({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;

	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		return <SignInRequired />;
	}

	const guildData = await getGuildSettings(guildId, token, "danger");

	if (!guildData) {
		return <UnknownGuildOrMissingAccess />;
	}

	const { settings } = guildData;

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

					<DownloadLevelingData guildId={guildId} levelingSystemEnabled={settings.levels} token={token} />

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

export const metadata: Metadata = {
	title: "Danger Dashboard",
	description: "Dangerous actions regarding your server configuration",
};
