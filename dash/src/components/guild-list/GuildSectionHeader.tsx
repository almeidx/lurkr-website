"use client";

import { Chip } from "@heroui/react";
import type { ReactNode } from "react";

export function GuildSectionHeader({ chipContent, chipClassName, count }: GuildSectionHeaderProps) {
	return (
		<div className="flex items-center gap-3">
			<Chip className={chipClassName} size="sm">
				{chipContent}
			</Chip>
			<div className="h-px flex-1 bg-white/10" />
			<span className="text-sm text-white/40">
				{count} {count === 1 ? "server" : "servers"}
			</span>
		</div>
	);
}

interface GuildSectionHeaderProps {
	chipClassName: string;
	chipContent: ReactNode;
	count: number;
}
