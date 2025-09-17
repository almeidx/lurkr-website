"use server";

import { cookies } from "next/headers";
import { enum_, maxValue, minValue, object, parse, pipe } from "valibot";
import { LevelingImportBot } from "@/lib/guild.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { coerceToInt, requiredSnowflake, toggle } from "@/utils/schemas.ts";
import type { GetImportStatusResponse } from "./01-leveling-import.tsx";
import { StartImportError } from "./import-status.tsx";

const importBotDataSchema = object({
	bot: enum_(LevelingImportBot),
	until: pipe(coerceToInt, minValue(3), maxValue(20)),
	withRoleRewards: toggle,
});

export async function importBotData(rawGuildId: string, _currentState: unknown, data: FormData) {
	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		throw new Error("Missing token");
	}

	const guildId = parse(requiredSnowflake, rawGuildId);
	const options = parse(importBotDataSchema, formDataToObject(data));

	// console.log(options);

	const response = await makeApiRequest(`/levels/${guildId}/import`, token, {
		body: JSON.stringify(options),
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
	});

	if (!response.ok) {
		if (response.status === 429) {
			return { error: StartImportError.RateLimited };
		}

		console.error("Failed to start leveling import", response.status, await response.text());
		return { error: StartImportError.Unknown };
	}

	return response.json() as Promise<StartLevelingImportResult>;
}

export async function getOngoingImportStatus(rawGuildId: string) {
	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		throw new Error("Missing token");
	}

	const guildId = parse(requiredSnowflake, rawGuildId);

	const response = await makeApiRequest(`/levels/${guildId}/import`, token, {
		next: {
			revalidate: 5,
			tags: [`import-status:${guildId}`],
		},
	});

	if (!response.ok) {
		return null;
	}

	return response.json() as Promise<GetImportStatusResponse>;
}

export interface StartLevelingImportResult {
	id: string;
}
