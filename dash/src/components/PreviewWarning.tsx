"use client";

import { TriangleExclamation } from "@gravity-ui/icons";
import { CloseButton } from "@heroui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { ExternalLink } from "./ExternalLink.tsx";

export function PreviewWarning() {
	const [isClosed, setIsClosed] = useState(false);

	useEffect(() => {
		if (!isClosed) {
			document.body.style.paddingTop = "2.75rem";
		}
		return () => {
			document.body.style.paddingTop = "";
		};
	}, [isClosed]);

	if (isClosed) {
		return null;
	}

	const isBeta = process.env.ENVIRONMENT === "beta";
	const isPtb = process.env.ENVIROMENT === "ptb";

	const versionName = isBeta ? "Beta Preview" : isPtb ? "Public Test Build" : "Unstable Preview";

	return (
		<div
			className={clsx(
				"fixed top-0 right-0 left-0 z-50 flex items-center justify-center gap-2 border-white/10 border-b px-4 py-2 text-center text-sm",
				{
					"bg-gray-600": isBeta,
					"bg-red-700": !isBeta && !isPtb,
					"bg-yellow-600": isPtb,
				},
			)}
		>
			<TriangleExclamation className="size-4 shrink-0" />
			<span>
				<strong>{versionName}</strong> — Go to{" "}
				<ExternalLink className="underline" href="https://lurkr.gg">
					lurkr.gg
				</ExternalLink>{" "}
				for the stable version
			</span>
			<CloseButton className="ml-auto shrink-0" onPress={() => setIsClosed(true)} />
		</div>
	);
}
