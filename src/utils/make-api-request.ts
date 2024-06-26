import { API_URL } from "@/utils/constants.ts";

export async function makeApiRequest(route: string, token: string | null | undefined, init: RequestInit = {}) {
	if (token && !(init.headers as Record<string, string> | undefined)?.Authorization) {
		init.headers = {
			...init.headers,
			Authorization: `Bearer ${token}`,
		};
	}

	const fullUrl = route.startsWith("http") ? route : `${API_URL}${route}`;

	try {
		const response = await fetch(fullUrl, init);

		const authErrorHeader = response.headers.get("x-auth-error");
		if (authErrorHeader === "malformed") {
			console.error("Malformed token");
		}

		return response;
	} catch (error) {
		console.error("Failed to make API request:", error);

		throw new Error("Failed to make API request", { cause: error });
	}
}
