"use client";

import { useState } from "react";
import { Close } from "@/components/icons/mdi/close.tsx";
import { ExternalLink } from "./ExternalLink.tsx";

export function PreviewWarning() {
	const [isClosed, setIsClosed] = useState(false);

	if (isClosed) {
		return null;
	}

	return (
		<div className="fixed top-2 right-2 z-50 rounded-lg bg-red p-2 text-xs">
			<div className="flex items-center justify-between">
				<p className="font-bold">Unstable Preview</p>

				<button aria-label="Close preview warning" onClick={() => setIsClosed(true)} type="button">
					<Close aria-hidden className="text-xs" />
				</button>
			</div>

			<p>
				Go to{" "}
				<ExternalLink className="underline" href="https://lurkr.gg">
					lurkr.gg
				</ExternalLink>{" "}
				for the stable version
			</p>
		</div>
	);
}
