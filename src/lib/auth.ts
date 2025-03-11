import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

export async function getCurrentUser(token: string) {
	try {
		const response = await makeApiRequest("/users/@me", token);
		if (!response.ok) {
			return null;
		}

		return response.json() as Promise<User>;
	} catch {
		return null;
	}
}

export interface User {
	avatar: string | null;
	accentColour: string | null;
	accentType: UserAccentType | null;
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

export enum UserAccentType {
	AvatarAverage = "AvatarAverage",
	HighestRole = "HighestRole",
	Custom = "Custom",
}
