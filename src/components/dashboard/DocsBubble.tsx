import { ExternalLink } from "@/components/ExternalLink.tsx";
import { Help } from "@/components/icons/mdi/help.tsx";
import { DOCS_URL } from "@/utils/constants.ts";
import { Tooltip, TooltipAnchor, TooltipProvider } from "@ariakit/react";

export function DocsBubble({ tooltip, path }: DocsBubblePropos) {
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
		<TooltipProvider showTimeout={100}>
			<TooltipAnchor>{link}</TooltipAnchor>

			<Tooltip className="max-w-prose rounded-lg border border-white/25 bg-darker px-3 py-2">{tooltip}</Tooltip>
		</TooltipProvider>
	);
}

interface DocsBubblePropos {
	readonly path: string;
	readonly tooltip: string;
}
