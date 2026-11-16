import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/DashboardPage.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { ImportForm } from "./01-leveling-import.tsx";
import { LurkrImportSection } from "./05-lurkr-import-section.tsx";
import { getImportStatus } from "./import-api.ts";

export default async function ImportBots({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;
	const data = await getImportStatus(guildId);

	return (
		<DashboardPage title="Import Bots">
			<div className="mb-12 flex flex-col gap-4">
				<ImportForm data={data} guildId={guildId} />
				<LurkrImportSection guildId={guildId} />
			</div>
		</DashboardPage>
	);
}

export const metadata: Metadata = {
	description: "Import your leveling data from another bot into Lurkr!",
	title: "Import Leveling Dashboard",
};
