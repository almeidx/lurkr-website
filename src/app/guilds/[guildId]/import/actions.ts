"use server";

import { LevelingImportBot } from "@/lib/guild.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { coerceToInt, toggle } from "@/utils/schemas.ts";
import { cookies } from "next/headers";
import { enum_, maxValue, minValue, object, parse, pipe } from "valibot";
import type { GetImportStatusResponse } from "./01-leveling-import.tsx";
import { StartImportError } from "./import-status.tsx";

const importBotDataSchema = object({
	bot: enum_(LevelingImportBot),
	until: pipe(coerceToInt, minValue(3), maxValue(20)),
	withRoleRewards: toggle,
});

export async function importBotData(guildId: string, _currentState: unknown, data: FormData) {
	const token = cookies().get(TOKEN_COOKIE)?.value;
	if (!token) {
		throw new Error("Missing token");
	}

	const options = parse(importBotDataSchema, formDataToObject(data));

	console.log(options);

	const response = await makeApiRequest(`/levels/${guildId}/import`, token, {
		body: JSON.stringify(options),
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
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

export async function getOngoingImportStatus(guildId: string) {
	const token = cookies().get(TOKEN_COOKIE)?.value;
	if (!token) {
		throw new Error("Missing token");
	}

	const response = await makeApiRequest(`/levels/${guildId}/import`, token, {
		next: {
			tags: [`import-status:${guildId}`],
			revalidate: 5,
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
