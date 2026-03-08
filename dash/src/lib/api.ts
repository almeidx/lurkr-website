import ky, { type Hooks } from "ky";
import { TOKEN_COOKIE } from "@/utils/constants";
import { getCookie } from "@/utils/cookies";

if (!process.env.NEXT_PUBLIC_API_URL) {
	throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const retryableStatusCodes = [
	// 408, // Request Timeout
	429, // Too Many Requests
	500, // Internal Server Error
	502, // Bad Gateway
	503, // Service Unavailable
	504, // Gateway Timeout
];

const timeout = 30 * 1_000;

const sharedHooks: Hooks = {
	beforeError: [
		async (error) => {
			const { response } = error;

			let message = response.statusText || response.status.toString();

			try {
				const json = await response.json();
				if (typeof json === "object" && json !== null && "message" in json && typeof json.message === "string") {
					message += `: ${json.message}`;
				}
			} catch {
				// Ignore JSON parsing errors
			}

			// TODO: Show toast?

			error.message = message;
			return error;
		},
	],
};

export const api = ky.create({
	hooks: {
		...sharedHooks,
		afterResponse: [
			async (_request, _options, response) => {
				if (response.headers.get("x-auth-error") === "malformed") {
					// Clear the invalid token so the user isn't stuck in a broken auth state.
					if (typeof window === "undefined") {
						const { cookies } = await import("next/headers");
						const store = await cookies();
						try {
							store.delete(TOKEN_COOKIE);
						} catch {
							// This can fail if it runs outside a Server Action or API route. e.g. RSC rendering
						}
					} else {
						const { default: Cookies } = await import("js-cookie");
						Cookies.remove(TOKEN_COOKIE);
					}
				}
			},
		],
		beforeRequest: [
			async (request, _options) => {
				// Populate the Authorization header with the token if it is not already set and exists.
				if (!request.headers.has("Authorization")) {
					const token = await getCookie(TOKEN_COOKIE);
					if (token) {
						request.headers.set("Authorization", `Bearer ${token}`);
					}
				}

				// If we're running on the server, add user-agent header
				if (typeof window === "undefined") {
					if (!request.headers.has("User-Agent")) {
						request.headers.set("User-Agent", `LurkrWebsite/1.0 Node.js/${process.version}`);
					}
				}
			},
		],
	},
	prefixUrl: process.env.NEXT_PUBLIC_API_URL,
	retry: {
		limit: 3,
		statusCodes: retryableStatusCodes,
	},
	timeout,
});

export const localApi = ky.create({
	hooks: sharedHooks,
	prefixUrl: "/",
	retry: {
		limit: 3,
		statusCodes: retryableStatusCodes,
	},
	timeout,
});
