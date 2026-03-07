import { makeApiRequest } from "@/utils/make-api-request.ts";

export async function getUserBackground(token: string): Promise<string | null> {
	const response = await makeApiRequest("/users/@me/background", token);
	if (!response.ok) {
		return null;
	}

	const { url } = (await response.json()) as GetCurrentUserBackgroundResponse;
	return url;
}

interface GetCurrentUserBackgroundResponse {
	url: string;
}
