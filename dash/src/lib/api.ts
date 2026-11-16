import ky, { type AfterResponseHook, type BeforeErrorHook, type BeforeRequestHook, isHTTPError } from "ky";
import { TOKEN_COOKIE, TOKEN_COOKIE_SCOPE } from "@/utils/constants.ts";

if (!process.env.NEXT_PUBLIC_API_URL) {
	throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const isServer = typeof window === "undefined";

const appendApiMessage: BeforeErrorHook = ({ error }) => {
	if (!isHTTPError(error)) {
		return error;
	}

	const { data, response } = error;

	error.message = response.statusText || response.status.toString();
	if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
		error.message += `: ${data.message}`;
	}

	return error;
};

// `next/headers` is imported lazily because this module is also bundled for the browser, where it doesn't exist.
async function serverCookies() {
	const { cookies } = await import("next/headers");
	return cookies();
}

const forwardTokenCookie: BeforeRequestHook = async ({ request }) => {
	if (!isServer) {
		return;
	}

	const token = (await serverCookies()).get(TOKEN_COOKIE)?.value;
	if (token) {
		request.headers.set("Authorization", `Bearer ${token}`);
	}
};

const clearMalformedToken: AfterResponseHook = async ({ response }) => {
	if (!isServer || response.headers.get("x-auth-error") !== "malformed") {
		return;
	}

	const store = await serverCookies();
	try {
		store.delete({ name: TOKEN_COOKIE, ...TOKEN_COOKIE_SCOPE });
	} catch {
		// Cookies can only be modified in Server Actions and Route Handlers, not while rendering.
	}
};

/**
 * Anonymous requests. They carry no credentials, so their responses can be shared through Next's fetch cache.
 */
export const publicApi = ky.create({
	headers: isServer ? { "User-Agent": `LurkrWebsite/1.0 Node.js/${process.version}` } : undefined,
	hooks: { beforeError: [appendApiMessage] },
	prefix: process.env.NEXT_PUBLIC_API_URL,
	retry: {
		limit: 3,
		statusCodes: [429, 500, 502, 503, 504],
	},
	timeout: 30_000,
});

/**
 * Requests on behalf of the signed-in user. Browsers send the HttpOnly token cookie themselves; on the server it is
 * forwarded as a bearer token.
 */
export const api = publicApi.extend({
	credentials: "include",
	hooks: {
		afterResponse: [clearMalformedToken],
		beforeRequest: [forwardTokenCookie],
	},
});
