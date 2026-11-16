import { api } from "@/lib/api.ts";

export async function getUserBackground() {
	const { url } = await api.get("users/@me/background").json<GetCurrentUserBackgroundResponse>();
	return url;
}

interface GetCurrentUserBackgroundResponse {
	url: string;
}
