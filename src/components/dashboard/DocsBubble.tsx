import { Tooltip, TooltipAnchor, TooltipProvider } from "@ariakit/react";
import Link from "next/link";
import { Help } from "@/components/icons/mdi/help.tsx";

export function DocsBubble({ tooltip, path }: DocsBubblePropos) {
	if (!path.startsWith("/")) {
		throw new Error("The path must start with a slash");
	}

	const link = (
		<Link href={`/docs${path}`}>
			<span className="sr-only">Open documentation</span>
			<Help aria-hidden className="ml-2 size-5" fill="url(#icon-gradient-tertiary)" />
		</Link>
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
