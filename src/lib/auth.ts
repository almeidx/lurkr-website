import type { Snowflake } from "@/utils/discord-cdn.ts";

export interface User {
	avatar: string | null;
	discriminator: string;
	globalName: string | null;
	locale: string;
	id: Snowflake;
	username: string;
}
