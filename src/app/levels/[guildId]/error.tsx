"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset(): void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-screen-no-footer bg-discord-dark grid place-items-center">
			<h2>{(error.cause as string) ?? "Something went wrong!"}</h2>
			<button onClick={() => reset()} type="button">
				Try again
			</button>
		</div>
	);
}
