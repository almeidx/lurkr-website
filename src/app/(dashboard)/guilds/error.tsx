"use client";

import { UnknownGuildOrMissingAccess } from "./[guildId]/unknown-guild.tsx";

export default function DashboardError({ error }: DashboardErrorProps) {
	console.error("Failed to load dashboard pages", error);

	return <UnknownGuildOrMissingAccess />;
}

interface DashboardErrorProps {
	error: Error & {
		digest?: string;
	};
	reset: () => void;
}
