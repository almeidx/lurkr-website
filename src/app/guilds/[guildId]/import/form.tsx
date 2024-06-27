"use client";

import { Form } from "@/components/dashboard/Form.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import type { LevelingImportBot, LevelingImportError } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { Time } from "@/utils/time.ts";
import { SystemUpdate } from "@mui/icons-material";
import { useActionState, useEffect, useRef, useState } from "react";
import { BotSelector } from "./01-bot-selector.tsx";
import { IncludeRoleRewards } from "./02-include-role-rewards.tsx";
import { ImportUntil } from "./03-import-until.tsx";
import { getOngoingImportStatus, importBotData } from "./actions.ts";
import { ImportStatus, ImportStatusTitle } from "./import-status.tsx";

export function ImportForm({ guildId, data }: { guildId: Snowflake; data: GetImportStatusResponse | null }) {
	const [importStatusState, setImportStatusState] = useState<GetImportStatusResponse | null>(null);
	const [formState, formAction] = useActionState(importBotData.bind(null, guildId), null);
	const timeoutRef = useRef<NodeJS.Timeout>();

	const isOngoing = !!formState || (data?.completedAt === null && !data?.error);
	const isPrevious = !importStatusState;

	const importStatus = importStatusState ?? data;

	// biome-ignore lint/correctness/useExhaustiveDependencies: Intended
	useEffect(() => {
		if (!formState) {
			return;
		}

		async function updateData() {
			const data = await getOngoingImportStatus(guildId);
			setImportStatusState(data);

			if (data?.completedAt === null && !data?.error) {
				timeoutRef.current = setTimeout(updateData, 5 * Time.Seconds);
			}
		}

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(updateData, 2 * Time.Seconds);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [formState]);

	return (
		<Form title="Import Bots" action={formAction} withSaveButton={false}>
			<Section
				name="Import your servers leveling data from a different bot"
				docsPath="/guides/importing-levels-from-other-bots"
				tooltip="Import leveling data from other bots"
			>
				<Label sub="Limited to 1 use per hour">Lets get the import started…</Label>

				<div className="mt-2 flex flex-col flex-wrap gap-4">
					<BotSelector />

					<IncludeRoleRewards />

					<ImportUntil />
				</div>

				<button
					className="flex w-fit items-center justify-between gap-3 rounded-lg bg-green px-2 py-1 font-semibold text-lg text-shadow-regular transition-colors disabled:cursor-not-allowed disabled:bg-green/50 hover:bg-green/90 md:text-xl"
					disabled={isOngoing}
					type="submit"
				>
					Import
					<SystemUpdate className="size-5 drop-shadow-regular" />
				</button>
			</Section>

			{formState !== null || importStatus ? (
				<Section>
					<div className="flex flex-wrap items-center gap-4">
						<h3 className="flex items-center font-semibold text-xl md:text-[1.4rem]">
							{isPrevious ? "Previous Import Status" : "Import Status"}
						</h3>

						{importStatus && (
							<ImportStatusTitle
								createdAt={new Date(importStatus.createdAt)}
								completedAt={importStatus.completedAt ? new Date(importStatus.completedAt) : null}
							/>
						)}
					</div>

					<ImportStatus formState={formState} importStatus={importStatus} />
				</Section>
			) : null}
		</Form>
	);
}

export interface GetImportStatusResponse {
	createdAt: string;
	updatedAt: string;
	completedAt: string | null;
	progress: number;
	rewardsCount: number;
	bot: LevelingImportBot;
	error: LevelingImportError | null;
}
