"use client";

import { ExternalLink } from "@/components/ExternalLink.tsx";
import { Help } from "@/components/icons/mdi/help.tsx";
import { DOCS_URL } from "@/utils/constants.ts";
import { Tooltip, TooltipAnchor, useTooltipStore } from "@ariakit/react/tooltip";

export function DocsBubble({ tooltip, path }: DocsBubblePropos) {
	const tooltipStore = useTooltipStore({
		showTimeout: 100,
	});

	if (!path.startsWith("/")) {
		throw new Error("The path must start with a slash");
	}

	const link = (
		<ExternalLink href={`${DOCS_URL}${path}`}>
			<span className="sr-only">Open documentation in a new tab</span>
			<Help className="ml-2 size-5" fill="url(#icon-gradient-tertiary)" />
		</ExternalLink>
	);

	if (!tooltip) {
		return link;
	}

	return (
		<>
			<TooltipAnchor store={tooltipStore}>{link}</TooltipAnchor>

			<Tooltip
				className="max-w-prose text-balance rounded-lg border border-white/25 bg-darker px-3 py-2"
				store={tooltipStore}
			>
				{tooltip}
			</Tooltip>
		</>
	);
}

interface DocsBubblePropos {
	readonly path: string;
	readonly tooltip: string;
}
