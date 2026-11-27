import { isHTTPError } from "ky";
import { updateTag } from "next/cache";
import { notFound } from "next/navigation";
import { type BaseIssue, type GenericSchema, getDotPath, parse, safeParse } from "valibot";
import { api } from "@/lib/api.ts";
import type { Guild, GuildSettings, SaveResult } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import { requiredSnowflake } from "@/utils/schemas.ts";

/**
 * Responds with a 404 unless the `guildId` route param is a snowflake. Call it before putting the param into an API
 * path: the param is attacker-controlled and the request carries the user's token.
 */
export function assertGuildId(guildId: string) {
	if (!isSnowflake(guildId)) {
		notFound();
	}
}

/** Cache tag of everything derived from a guild's settings. */
export function settingsTag(guildId: Snowflake) {
	return `settings:${guildId}`;
}

export async function getGuildSettings(guildId: Snowflake) {
	assertGuildId(guildId);

	return api.get(`guilds/${guildId}`, { cache: "no-store" }).json<{ guild: Guild; settings: GuildSettings }>();
}

/**
 * Validates a settings form against `schema` and saves the result. Call it from a Server Action.
 */
export async function saveSettings(
	guildId: string,
	schema: GenericSchema<unknown, Partial<GuildSettings>>,
	form: FormData,
): Promise<SaveResult> {
	const result = safeParse(schema, Object.fromEntries(form));
	if (!result.success) {
		return { error: describeIssues(result.issues), ok: false };
	}

	const id = parse(requiredSnowflake, guildId);

	try {
		const { untrackedMentionedRoleIds = [] } = await api
			.patch(`guilds/${id}`, { json: result.output })
			.json<{ untrackedMentionedRoleIds?: Snowflake[] }>();

		updateTag(settingsTag(id));

		return { ok: true, untrackedMentionedRoleIds };
	} catch (error) {
		if (!isHTTPError(error)) {
			throw error;
		}

		console.error(`Failed to update guild ${id} settings:`, error.data);
		return { error: error.message, ok: false };
	}
}

function describeIssues(issues: readonly BaseIssue<unknown>[]) {
	return issues
		.map((issue) => {
			const path = getDotPath(issue);
			return path ? `${path}: ${issue.message}` : issue.message;
		})
		.join("\n");
}
