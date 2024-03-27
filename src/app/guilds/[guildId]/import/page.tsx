import { Form } from "@/components/dashboard/Form.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { API_URL, TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { BiImport } from "@react-icons/all-files/bi/BiImport";
import { cookies } from "next/headers";
import { BotSelector } from "./01-bot-selector.tsx";
import { IncludeRoleRewards } from "./02-include-role-rewards.tsx";
import { ImportUntil } from "./03-import-until.tsx";
import { importBotData } from "./action.ts";

const enum ImportStatus {
	Available = "Available",
	Failure = "Failure",
	Finished = "Finished",
	Started = "Started",
}

export default async function Miscellaneous({ params: { guildId } }: { readonly params: { guildId: Snowflake } }) {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { status } = await getData(guildId, token);

	const action = importBotData.bind(null, guildId);

	return (
		<Form title="Import Bots" action={action} withSaveButton={false}>
			<Section>
				<Text docsPath="/guides/importing-levels-from-other-bots">
					Import your servers leveling data from a different bot…
				</Text>

				<div className="flex items-end gap-2">
					<p className="text-lg tracking-tight text-white/75 md:text-xl">Lets get the import started…</p>
					<p className="mb-1 text-xs font-light text-white/50">(Limited to 1 use per hour)</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<BotSelector />

					<IncludeRoleRewards />

					<ImportUntil />
				</div>

				<button
					className="flex w-fit items-center justify-between gap-3 rounded-lg bg-green px-2 py-1 text-lg font-semibold transition-colors text-shadow-regular hover:bg-green/90 disabled:cursor-not-allowed disabled:bg-green/50 md:text-xl"
					disabled={status !== ImportStatus.Available}
					type="submit"
				>
					Import
					<BiImport className="drop-shadow-regular" size={22} />
				</button>
			</Section>
		</Form>
	);
}

async function getData(guildId: Snowflake, token: string) {
	const response = await fetch(`${API_URL}/guilds/${guildId}/import-status`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		next: {
			tags: ["guild-import-status"],
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch import status");
	}

	return response.json() as Promise<GetImportStatusResponse>;
}

interface GetImportStatusResponse {
	readonly error: string | null;
	readonly startedAt: string | null;
	readonly status: ImportStatus;
}
