"use client";

import { useEffect } from "react";
import { UnknownGuildOrMissingAccess } from "./[guildId]/unknown-guild.tsx";

export default function DashboardError({ error }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error("Failed to load dashboard pages", error);
	}, [error]);

	return <UnknownGuildOrMissingAccess />;
}
