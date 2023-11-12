import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export function getUser() {
	const token = cookies().get(TOKEN_COOKIE)?.value;

	if (!token) {
		throw new Error("Unauthenticated");
	}

	const { sub, ...user } = jwtDecode<User>(token);
	return { id: sub, ...user };
}

export function getUserSafe() {
	try {
		return getUser();
	} catch {
		return null;
	}
}

interface User {
	avatar: string | null;
	discriminator: string;
	globalName: string | null;
	locale: string;
	sub: Snowflake;
	username: string;
}
