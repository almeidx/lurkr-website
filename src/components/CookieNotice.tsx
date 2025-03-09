"use client";

import { COOKIE_NOTICE_ACK, COOKIE_NOTICE_COOKIE } from "@/utils/constants.ts";
import Cookies from "js-cookie";
import Link from "next/link";
import { useState } from "react";

export function CookieNotice({ defaultHasConsented }: { readonly defaultHasConsented: boolean }) {
	const [hasConsented, setHasConsented] = useState(defaultHasConsented);

	if (hasConsented) {
		return null;
	}

	function acceptCookies() {
		Cookies.set(COOKIE_NOTICE_COOKIE, COOKIE_NOTICE_ACK, {
			expires: 365,
			secure: true,
			sameSite: "strict",
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
				Okay
			</button>
		</div>
	);
}
