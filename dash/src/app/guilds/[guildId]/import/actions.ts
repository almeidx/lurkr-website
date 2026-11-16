"use server";

import { isHTTPError } from "ky";
import { unstable_rethrow } from "next/navigation";
import { enum_, maxValue, minValue, object, parse, pipe } from "valibot";
import { api } from "@/lib/api.ts";
import { LevelingImportBot } from "@/lib/guild.ts";
import { coerceToInt, requiredSnowflake, toggle } from "@/utils/schemas.ts";
import {
	getImportStatus,
	MAX_IMPORT_MIN_LEVEL,
	MIN_IMPORT_MIN_LEVEL,
	StartImportError,
	type StartLevelingImportResult,
} from "./import-api.ts";

const importBotDataSchema = object({
	bot: enum_(LevelingImportBot),
	minLevel: pipe(coerceToInt, minValue(MIN_IMPORT_MIN_LEVEL), maxValue(MAX_IMPORT_MIN_LEVEL)),
	withRoleRewards: toggle,
});

export async function importBotData(rawGuildId: string, _currentState: unknown, data: FormData) {
	const guildId = parse(requiredSnowflake, rawGuildId);
	const options = parse(importBotDataSchema, Object.fromEntries(data));

	try {
		return await api.post(`levels/${guildId}/import`, { json: options }).json<StartLevelingImportResult>();
	} catch (error) {
		unstable_rethrow(error);

		if (isHTTPError(error)) {
			if (error.response.status === 429) {
				return { error: StartImportError.RateLimited };
			}

			console.error("Failed to start leveling import", error.response.status, error.data);
		} else {
			console.error("Failed to start leveling import", error);
		}

		return { error: StartImportError.Unknown };
	}
}

export async function getOngoingImportStatus(rawGuildId: string) {
	const guildId = parse(requiredSnowflake, rawGuildId);

	return getImportStatus(guildId);
}
