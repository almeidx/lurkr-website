import { isHTTPError } from "ky";
import { unstable_rethrow } from "next/navigation";
import { api } from "@/lib/api.ts";
import type { LevelingImportBot, LevelingImportError } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export const MIN_IMPORT_MIN_LEVEL = 3;
export const MAX_IMPORT_MIN_LEVEL = 20;

export enum StartImportError {
	RateLimited = 0,
	Unknown = 1,
}

export interface StartLevelingImportResult {
	id: string;
}

/**
 * The guild's latest leveling import, or `null` if there is none or it can't be loaded. The status is secondary to
 * the import form, so a failure only hides it.
 */
export async function getImportStatus(guildId: Snowflake) {
	try {
		return await api.get(`levels/${guildId}/import`, { next: { revalidate: 5 } }).json<GetImportStatusResponse>();
	} catch (error) {
		unstable_rethrow(error);
		if (!isHTTPError(error) || error.response.status !== 404) {
			console.error("Failed to fetch the leveling import status", error);
		}

		return null;
	}
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
