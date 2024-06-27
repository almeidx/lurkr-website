import { LoadingSpinner } from "@/components/LoadingSpinner.tsx";
import { LevelingImportError } from "@/lib/guild.ts";
import { dateToRelativeTimeAgo } from "@/utils/date-to-relative-time-ago.ts";
import { Done, Error as ErrorIcon } from "@mui/icons-material";
import type { StartLevelingImportResult } from "./actions.ts";
import type { GetImportStatusResponse } from "./form.tsx";

export function ImportStatusTitle({ createdAt, completedAt }: { createdAt: Date; completedAt: Date | null }) {
	const createdAt_ = new Date(createdAt);
	const completedAt_ = completedAt && new Date(completedAt);

	return (
		<div className="text-white/75">
			Started{" "}
			<time title={createdAt_.toLocaleString("en-GB")} dateTime={createdAt_.toISOString()} suppressHydrationWarning>
				{dateToRelativeTimeAgo(createdAt_, "en-GB")}
			</time>
			{completedAt_ ? (
				<>
					{" "}
					- Completed{" "}
					<time
						title={completedAt_.toLocaleString("en-GB")}
						dateTime={completedAt_.toISOString()}
						suppressHydrationWarning
					>
						{dateToRelativeTimeAgo(completedAt_, "en-GB")}
					</time>
				</>
			) : null}
		</div>
	);
}

export function ImportStatus({ formState, importStatus }: ImportStatusProps) {
	// User hasn't started the import yet
	if (formState === null && !importStatus) {
		return null;
	}

	// User has started the import
	if (formState && !importStatus) {
		return <p>The leveling import is starting…</p>;
	}

	// Import failed to start
	if (formState === false) {
		return (
			<>
				<p>The leveling import has failed.</p>

				<div className="flex items-center gap-2">
					<ErrorIcon className="text-red" />
					<p>Failed to start. Please, try again later.</p>
				</div>
			</>
		);
	}

	// In theory, this should never happen, so this is here to satisfy TypeScript
	if (!importStatus) {
		return null;
	}

	// Import has failed
	if (importStatus.error) {
		return (
			<>
				<p>The leveling import has failed.</p>

				<div className="flex items-center gap-2">
					<ErrorIcon className="text-red" />
					<p>{getImportStatusErrorText(importStatus.error)}</p>
				</div>
			</>
		);
	}

	// Import has completed
	if (importStatus.completedAt) {
		return (
			<>
				<div className="flex items-center gap-2">
					<Done className="text-green" />

					<p>The leveling import has completed successfully. {importStatus.progress} users were imported.</p>
				</div>
			</>
		);
	}

	// Import is still in progress

	const updatedAt_ = new Date(importStatus.updatedAt);

	return (
		<>
			<div className="flex items-center gap-2">
				<LoadingSpinner />

				<p>
					The leveling import is still in progress. Last update{" "}
					<time title={updatedAt_.toLocaleString("en-GB")} dateTime={updatedAt_.toISOString()} suppressHydrationWarning>
						{dateToRelativeTimeAgo(updatedAt_, "en-GB")}
					</time>
					.
				</p>
			</div>

			<p>{importStatus.progress} users imported so far.</p>
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
	readonly formState: false | StartLevelingImportResult | null;
	readonly importStatus: GetImportStatusResponse | null;
}
