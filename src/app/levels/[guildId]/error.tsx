"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset(): void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-screen-no-footer bg-discord-dark flex flex-col items-center justify-center gap-4 text-white">
			<h2 className="text-xl font-bold">{typeof error.cause === "string" ? error.cause : "Something went wrong!"}</h2>
			<button
				className="bg-discord-not-quite-black hover:bg-discord-lighter flex cursor-pointer items-center justify-center rounded-md px-2 py-1 shadow-md transition-colors"
				onClick={() => reset()}
				type="button"
			>
				Try again
			</button>
		</div>
	);
}
