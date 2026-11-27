"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { LOGIN_FAILURE_PARAM } from "@/utils/constants.ts";

/**
 * Reports a failed sign-in that the OAuth callback redirected here.
 *
 * The URL is read inside the effect rather than through `useSearchParams`, which keeps the home page static and makes
 * a repeated effect run find the parameter already removed.
 */
export function LoginFailureNotice() {
	useEffect(() => {
		const url = new URL(window.location.href);
		if (!url.searchParams.has(LOGIN_FAILURE_PARAM)) {
			return;
		}

		url.searchParams.delete(LOGIN_FAILURE_PARAM);
		window.history.replaceState(null, "", url);

		toast.error("Failed to sign in", { description: "Something went wrong while signing you in. Please try again." });
	}, []);

	return null;
}
