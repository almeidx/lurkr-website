import { api } from "@/lib/api.ts";

export async function getUserBackground(): Promise<string | null> {
	try {
		const { url } = await api.get("users/@me/background").json<GetCurrentUserBackgroundResponse>();
		return url;
	} catch {
		return null;
	}
}

interface GetCurrentUserBackgroundResponse {
	url: string;
}
