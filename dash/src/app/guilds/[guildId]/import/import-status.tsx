import { Done } from "@/components/icons/mdi/done.tsx";
import { ErrorOutline } from "@/components/icons/mdi/error-outline.tsx";
import { LoadingSpinner } from "@/components/LoadingSpinner.tsx";
import { LevelingImportError } from "@/lib/guild.ts";
import { dateToRelativeTimeAgo } from "@/utils/date-to-relative-time-ago.ts";
import type { GetImportStatusResponse, StartImportError, StartLevelingImportResult } from "./import-api.ts";

export function ImportStatusTitle({ createdAt, completedAt }: { createdAt: Date; completedAt: Date | null }) {
	const createdAt_ = new Date(createdAt);
	const completedAt_ = completedAt && new Date(completedAt);

	return (
		<div className="text-white/75">
			Started{" "}
			<time dateTime={createdAt_.toISOString()} suppressHydrationWarning title={createdAt_.toLocaleString("en-GB")}>
				{dateToRelativeTimeAgo(createdAt_, "en-GB")}
			</time>
			{completedAt_ ? (
				<>
					{" "}
					- Completed{" "}
					<time
						dateTime={completedAt_.toISOString()}
						suppressHydrationWarning
						title={completedAt_.toLocaleString("en-GB")}
					>
						{dateToRelativeTimeAgo(completedAt_, "en-GB")}
					</time>
				</>
			) : null}
		</div>
	);
}

export function ImportStatus({ formState, importStatus }: ImportStatusProps) {
	if (formState && "error" in formState) {
		return <ImportFailed message="Failed to start. Please, try again later." />;
	}

	if (!importStatus) {
		return formState ? <p>The leveling import is starting…</p> : null;
	}

	if (importStatus.error) {
		return <ImportFailed message={getImportStatusErrorText(importStatus.error)} />;
	}

	if (importStatus.completedAt) {
		return (
			<div className="flex items-center gap-2">
				<Done className="text-green" />

				<p>
					The leveling import has completed successfully. {importStatus.progress.toLocaleString("en")} users were
					imported.
				</p>
			</div>
		);
	}

	const updatedAt_ = new Date(importStatus.updatedAt);

	return (
		<>
			<div className="flex items-center gap-2">
				<LoadingSpinner />

				<p>
					The leveling import is still in progress. Last update{" "}
					<time dateTime={updatedAt_.toISOString()} suppressHydrationWarning title={updatedAt_.toLocaleString("en-GB")}>
						{dateToRelativeTimeAgo(updatedAt_, "en-GB")}
					</time>
					.
				</p>
			</div>

			<p>{importStatus.progress.toLocaleString("en")} users imported so far.</p>
		</>
	);
}

function ImportFailed({ message }: { readonly message: string }) {
	return (
		<>
			<p>The leveling import has failed.</p>

			<div className="flex items-center gap-2">
				<ErrorOutline className="text-red" />
				<p>{message}</p>
			</div>
		</>
	);
}

function getImportStatusErrorText(error: LevelingImportError): string {
	switch (error) {
		case LevelingImportError.LeaderboardNotFound:
			return "The other bots leaderboard could not be found. Make sure it is enabled and is set to public.";

		case LevelingImportError.PrivateLeaderboard:
			return "The other bots leaderboard is private. Make sure it is set to public.";

		case LevelingImportError.LeaderboardEmpty:
			return "The other bots leaderboard is empty. Make sure there are users in the leaderboard.";

		case LevelingImportError.RateLimited:
			return "Lurkr is currently being rate limited by the other bot. Please try again later.";

		case LevelingImportError.SchemaMismatch:
		case LevelingImportError.NonJSONResponse:
			return "The other bot returned an unexpected response. Please try again later.";

		default:
			return "An unknown error occurred. Please try again later.";
	}
}

interface ImportStatusProps {
	readonly formState: StartLevelingImportResult | { error: StartImportError } | null;
	readonly importStatus: GetImportStatusResponse | null;
}
