"use server";

import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { formDataToObject } from "@/utils/form-data-to-object.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { toggle } from "@/utils/schemas.ts";
import { cookies } from "next/headers";
import { literal, object, parse, pipe, string, transform, union } from "valibot";
import type { GetImportStatusResponse } from "./form.tsx";

const importBotDataSchema = object({
	bot: union([literal("Mee6"), literal("Amari")]),
	until: pipe(
		string(),
		transform((value) => Number(value)),
	),
	withRoleRewards: toggle,
});

export async function importBotData(guildId: string, _currentState: any, data: FormData) {
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
		console.error("Failed to start leveling import", response.status, await response.text());

		return false;
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
