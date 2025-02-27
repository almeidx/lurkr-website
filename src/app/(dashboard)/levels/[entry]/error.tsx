"use client";

import { useEffect } from "react";
import { UnknownGuildOrDisabledLevels } from "./unknown-guild.tsx";

export default function DashboardError({
	error,
}: {
	readonly error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Failed to load dashboard pages", error);
	}, [error]);

	return <UnknownGuildOrDisabledLevels />;
}
