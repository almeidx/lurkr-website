import { api } from "@/lib/api.ts";
import type { ApiKeyPermission } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export async function getUserApiKeys() {
	try {
		const { keys } = await api.get("users/@me/keys").json<GetUserApiKeysResult>();
		return keys;
	} catch {
		return [];
	}
}

export interface GetUserApiKeysResult {
	keys: {
		id: string;
		name: string;
		createdAt: string;
		expiresAt: string | null;
		permission: ApiKeyPermission;
		lastUsedAt: string | null;
		guildAccess: {
			createdAt: string;
			guildId: Snowflake;
		}[];
	}[];
}
