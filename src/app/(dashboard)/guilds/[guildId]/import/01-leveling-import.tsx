"use client";

import { Label } from "@/components/dashboard/Label.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import type { LevelingImportBot, LevelingImportError } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { Time } from "@/utils/time.ts";
import { useActionState, useEffect, useRef, useState } from "react";
import { BotSelector } from "./02-bot-selector.tsx";
import { IncludeRoleRewards } from "./03-include-role-rewards.tsx";
import { ImportMinLevel } from "./04-import-min-level.tsx";
import { getOngoingImportStatus, importBotData } from "./actions.ts";
import { BeginImportButton } from "./begin-import-button.tsx";
import { ImportStatus, ImportStatusTitle, StartImportError } from "./import-status.tsx";

export function ImportForm({ guildId, data }: { guildId: Snowflake; data: GetImportStatusResponse | null }) {
	const [importStatusState, setImportStatusState] = useState<GetImportStatusResponse | null>(null);
	const [formState, formAction] = useActionState(importBotData.bind(null, guildId), null);
	const intervalRef = useRef<NodeJS.Timeout>(null);

	const importStatus = importStatusState ?? data;

	const lastImportIsWithinHour = !!data && dateIsYoungerThanHours(new Date(data.createdAt), 1);
	const importOngoing = importStatusState?.completedAt === null;
	const isRateLimited = !!formState && "error" in formState && formState?.error === StartImportError.RateLimited;

	// biome-ignore lint/correctness/useExhaustiveDependencies: Intended
	useEffect(() => {
		async function updateData() {
			const data = await getOngoingImportStatus(guildId);
			setImportStatusState(data);
		}

		function startInterval() {
			stopInterval();

			intervalRef.current = setInterval(updateData, 5 * Time.Seconds);
		}

		function stopInterval() {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}

		function handleVisibilityChange() {
			if (document.hidden) {
				stopInterval();
			} else {
				startInterval();
			}
		}

		document.addEventListener("visibilitychange", handleVisibilityChange);

		startInterval();

		return () => {
			stopInterval();
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	return (
		// The form container must be kept in sync with the @/components/dashboard/Form.tsx component
		// The component itself is not being used here because it wraps the action in `useActionState`,
		// But the action is already being wrapped in this component
		<div className="flex w-full flex-col gap-5 px-4 py-4">
			<div className="space-y-2">
				<h2 className="font-semibold text-2xl">Import Bots</h2>
			</div>

			<form action={formAction} className="mb-12 flex flex-col gap-4">
				<Section
					name="Import your servers leveling data from a different bot"
					docsPath="/guides/importing-levels-from-other-bots"
					tooltip="Import leveling data from other bots"
				>
					<Label sub="Limited to 1 use per hour">Lets get the import started…</Label>

					<div className="mt-2 flex flex-col flex-wrap gap-4">
						<BotSelector />

						<IncludeRoleRewards />

						<ImportMinLevel />
					</div>

					<BeginImportButton importOngoing={importOngoing} isRateLimited={isRateLimited || lastImportIsWithinHour} />
				</Section>

				{formState && "error" in formState ? null : formState !== null || importStatus ? (
					<Section>
						<div className="flex flex-wrap items-center gap-4">
							<h3 className="flex items-center font-semibold text-xl md:text-[1.4rem]">Import Status</h3>

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
			</form>
		</div>
	);
}

function dateIsYoungerThanHours(date: Date, hours: number) {
	return Date.now() - date.getTime() < hours * Time.Hours;
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
