import { Time } from "@/utils/time.ts";
import { cookies } from "next/headers";
import Link from "next/link";

const COOKIE_CONSENT = "cookie_consent";
const COOKIE_CONSENT_VALUE = "1";

export function CookieNotice() {
	const hasConsented = cookies().get(COOKIE_CONSENT)?.value === COOKIE_CONSENT_VALUE;

	if (hasConsented) {
		return null;
	}

	async function acceptCookies() {
		"use server";

		cookies().set(COOKIE_CONSENT, COOKIE_CONSENT_VALUE, {
			httpOnly: true,
			path: "/",
			sameSite: "strict",
			secure: true,
			expires: new Date(Date.now() + Time.Years),
		});
	}

	return (
		<form
			action={acceptCookies}
			className="fixed right-8 bottom-8 left-8 z-[100003] flex flex-col rounded-md border border-white/25 bg-darker px-3 py-2 sm:left-auto sm:max-w-xl"
		>
			<p className="mb-2 font-bold text-xl">Cookies</p>

			<p>
				We use functional cookies to provide you with the best experience on our website. For more information, please
				refer to our{" "}
				<Link className="text-blue-400 hover:text-blue-600" href="/privacy">
					Privacy Policy
				</Link>
				.
			</p>

			<button className="mt-2 w-fit rounded-md bg-primary px-3 py-1 hover:bg-primary/75" type="submit">
				Accept
			</button>
		</form>
	);
}
