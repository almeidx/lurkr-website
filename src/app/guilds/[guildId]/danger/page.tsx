import { Separator } from "@/components/Separator.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { DownloadLevelingData } from "./01-download-leveling-data.tsx";
import { ResetAll } from "./02-reset-all.tsx";

export default function DangerZone() {
	return (
		<div className="flex w-full flex-col gap-5 px-4 py-4">
			<h2 className="pl-10 text-2xl font-semibold md:pl-0">Danger Zone</h2>

			<div className="mb-12 flex flex-col gap-4">
				<Section>
					<Text docsPath="/guides/exporting-leveling-leaderboard">Download the leveling database for your server…</Text>

					<DownloadLevelingData />

					<Separator />

					<Text docsPath="/config-commands/config/delete-all">
						Reset all settings & leveling database for your server…
					</Text>

					<p className="text-lg tracking-tighter text-red md:text-xl">
						CAUTION: This action is irreversible! Please make sure you want to do this before proceeding.
					</p>

					<ResetAll />
				</Section>
			</div>
		</div>
	);
}
