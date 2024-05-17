import { Form } from "@/components/dashboard/Form.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { SystemUpdate } from "@mui/icons-material";
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

				<Label sub="Limited to 1 use per hour">Lets get the import started…</Label>

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
					<SystemUpdate className="drop-shadow-regular size-5" />
				</button>
			</Section>
		</Form>
	);
}

async function getData(guildId: Snowflake, token: string) {
	const response = await makeApiRequest(`/guilds/${guildId}/import-status`, token, {
		next: {
			tags: [`import-status:${guildId}`],
			revalidate: 15,
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
