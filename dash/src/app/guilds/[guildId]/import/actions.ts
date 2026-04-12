"use server";

import { isHTTPError } from "ky";
import { enum_, maxValue, minValue, object, parse, pipe } from "valibot";
import { api } from "@/lib/api.ts";
import { LevelingImportBot } from "@/lib/guild.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { coerceToInt, requiredSnowflake, toggle } from "@/utils/schemas.ts";
import type { GetImportStatusResponse } from "./01-leveling-import.tsx";
import { StartImportError } from "./import-status.tsx";

const importBotDataSchema = object({
	bot: enum_(LevelingImportBot),
	minLevel: pipe(coerceToInt, minValue(3), maxValue(20)),
	withRoleRewards: toggle,
});

export async function importBotData(rawGuildId: string, _currentState: unknown, data: FormData) {
	const guildId = parse(requiredSnowflake, rawGuildId);
	const options = parse(importBotDataSchema, formDataToObject(data));

	try {
		return await api.post(`levels/${guildId}/import`, { json: options }).json<StartLevelingImportResult>();
	} catch (error) {
		if (isHTTPError(error)) {
			if (error.response.status === 429) {
				return { error: StartImportError.RateLimited };
			}

			console.error("Failed to start leveling import", error.response.status, error.data);
		}

		return { error: StartImportError.Unknown };
	}
}

export async function getOngoingImportStatus(rawGuildId: string) {
	const guildId = parse(requiredSnowflake, rawGuildId);

	try {
		return await api
			.get(`levels/${guildId}/import`, {
				next: { revalidate: 5, tags: [`import-status:${guildId}`] },
			})
			.json<GetImportStatusResponse>();
	} catch {
		return null;
	}
}

export interface StartLevelingImportResult {
	id: string;
}
