"use client";

import { UnknownGuildOrDisabledLevels } from "./unknown-guild.tsx";

export default function DashboardError({ error }: DashboardErrorProps) {
	console.error("Failed to load dashboard pages", error);

	return <UnknownGuildOrDisabledLevels />;
}

interface DashboardErrorProps {
	readonly error: Error & {
		digest?: string;
	};
	reset: () => void;
}
