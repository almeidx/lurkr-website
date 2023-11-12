"use client";

import { ExternalLink } from "@/components/ExternalLink.tsx";
import { Tooltip, TooltipAnchor, useTooltipStore } from "@ariakit/react/tooltip";
import { RiQuestionFill } from "@react-icons/all-files/ri/RiQuestionFill";
import { DOCS_URL } from "../../../shared-links.mjs";

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
			<RiQuestionFill className="ml-2 fill-icon-gradient-tertiary" size={20} />
		</ExternalLink>
	);

	if (!tooltip) {
		return link;
	}

	return (
		<>
			<TooltipAnchor store={tooltipStore}>{link}</TooltipAnchor>

			<Tooltip
				className="bg-darker max-w-prose text-balance px-3 py-2 rounded-lg border border-white/25"
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
