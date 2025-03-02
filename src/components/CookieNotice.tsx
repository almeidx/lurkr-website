"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_CONSENT_COOKIE = "biscuits";
const ACK_VALUE = "aye";

export function CookieNotice() {
	const [hasConsented, setHasConsented] = useState<boolean | null>(null);

	useEffect(() => {
		const cookieValue = Cookies.get(COOKIE_CONSENT_COOKIE);
		setHasConsented(cookieValue === ACK_VALUE);
	}, []);

	if (hasConsented === null || hasConsented === true) {
		return null;
	}

	function acceptCookies() {
		const expiryDate = new Date();
		expiryDate.setFullYear(expiryDate.getFullYear() + 1);

		Cookies.set(COOKIE_CONSENT_COOKIE, ACK_VALUE, {
			path: "/",
			sameSite: "strict",
			secure: true,
			expires: expiryDate,
		});

		setHasConsented(true);
	}

	return (
		<div className="fixed right-8 bottom-8 left-8 z-100003 flex flex-col rounded-md border border-white/25 bg-darker px-3 py-2 sm:left-auto sm:max-w-xl">
			<p className="mb-2 font-bold text-xl">Cookies</p>

			<p>
				We use functional cookies to provide you with the best experience on our website. For more information, please
				refer to our{" "}
				<Link className="text-blue-400 hover:text-blue-600" href="/privacy">
					Privacy Policy
				</Link>
				.
			</p>

			<button
				className="mt-2 w-fit rounded-md bg-primary px-3 py-1 hover:bg-primary/75"
				type="button"
				onClick={acceptCookies}
			>
				Accept
			</button>
		</div>
	);
}
