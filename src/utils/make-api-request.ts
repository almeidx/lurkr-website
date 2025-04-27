import { API_URL } from "@/utils/constants.ts";
import pRetry, { AbortError } from "p-retry";

export async function makeApiRequest(route: string, token: string | null | undefined, init: RequestInit = {}) {
	return pRetry(
		async () => {
			if (token && !(init.headers as Record<string, string> | undefined)?.Authorization) {
				init.headers = {
					...init.headers,
					Authorization: `Bearer ${token}`,
				};
			}

			const fullUrl = route.startsWith("http") ? route : `${API_URL}${route}`;

			const response = await fetch(fullUrl, init);

			// Do not retry on 4xx errors
			if (response.status >= 400 && response.status < 500) {
				let message = response.statusText || response.status.toString();

				if (response.headers.get("content-type")?.includes("application/json")) {
					try {
						const json = await response.json();
						if (typeof json === "object" && json !== null && "message" in json && typeof json.message === "string") {
							message += `: ${json.message}`;
						}
					} catch {
						// Ignore
					}
				}

				throw new AbortError(message);
			}

			const authErrorHeader = response.headers.get("x-auth-error");
			if (authErrorHeader === "malformed") {
				console.error("Malformed token");
			}

			return response;
		},
		{
			retries: 3,
			onFailedAttempt: (error) => {
				console.error(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
			},
		},
	);
}
