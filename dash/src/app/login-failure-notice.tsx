"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { LOGIN_FAILURE_PARAM } from "@/utils/constants.ts";

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
