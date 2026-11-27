import { isHTTPError } from "ky";
import { unstable_rethrow } from "next/navigation";
import type { UserGuildInfo } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { api } from "./api.ts";

/**
 * Resolves to `null` only when the API reports that the visitor is signed out. Any other failure is thrown, so an
 * outage is never mistaken for being signed out.
 */
export async function getCurrentUser() {
	try {
		return await api.get("users/@me").json<User>();
	} catch (error) {
		unstable_rethrow(error);

		if (isHTTPError(error) && error.response.status === 401) {
			return null;
		}

		throw error;
	}
}

export async function getUserGuilds(searchParams?: { botIn?: boolean; isAdmin?: boolean }) {
	return api.get("users/@me/guilds", { next: { revalidate: 60 }, searchParams }).json<UserGuildInfo[]>();
}

export interface User {
	avatar: string | null;
	accentColour: string | null;
	discriminator: string;
	hasBackground: boolean;
	globalName: string | null;
	id: Snowflake;
	locale: string | null;
	premium: PremiumTier;
	premiumGuild: {
		id: Snowflake;
		icon: string | null;
		name: string;
	} | null;
	username: string;
}

export enum PremiumTier {
	None = "None",
	Basic = "Basic",
	Guild = "Guild",
}
