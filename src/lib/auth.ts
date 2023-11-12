import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export function getUser() {
	const user = getUserSafe();
	if (!user) {
		throw new Error("Unauthenticated");
	}

	return user;
}

export function getUserSafe() {
	const token = cookies().get(TOKEN_COOKIE)?.value;
	if (!token) return null;

	try {
		const { sub, ...user } = jwtDecode<User>(token);
		return { id: sub, ...user };
	} catch (error) {
		console.error("Failed to decode user token:", error);
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
