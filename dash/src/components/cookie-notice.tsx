"use client";

import { Button, Surface } from "@heroui/react";
import { linkVariants } from "@heroui/styles";
import Cookies from "js-cookie";
import NextLink from "next/link";
import { useState } from "react";
import { COOKIE_NOTICE_ACK, COOKIE_NOTICE_COOKIE } from "@/utils/constants.ts";

const linkClasses = linkVariants().base();

export function CookieNotice({ defaultHasConsented }: { readonly defaultHasConsented: boolean }) {
	const [hasConsented, setHasConsented] = useState(defaultHasConsented);

	if (hasConsented) {
		return null;
	}

	function acceptCookies() {
		Cookies.set(COOKIE_NOTICE_COOKIE, COOKIE_NOTICE_ACK, {
			expires: 365,
			sameSite: "strict",
			secure: true,
		});

		setHasConsented(true);
	}

	return (
		<Surface className="fixed right-4 bottom-4 left-4 z-100003 rounded-xl p-4 sm:left-auto sm:max-w-md">
			<p className="font-semibold text-lg">Cookies</p>

			<p className="mt-1 text-sm text-white/70">
				We use functional cookies to provide you with the best experience on our website. For more information, please
				refer to our{" "}
				<NextLink className={linkClasses} href="/privacy">
					Privacy Policy
				</NextLink>
				.
			</p>

			<Button className="mt-3" onPress={acceptCookies} size="sm">
				Okay
			</Button>
		</Surface>
	);
}
