"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
	error,
}: {
	readonly error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Failed to load dashboard pages", error);
	}, [error]);

	return (
		<div className="mt-16 flex flex-col items-center gap-12">
			<h1 className="font-bold text-9xl tracking-widest">404</h1>
			<p className="flex flex-col items-center gap-2 text-center">
				This server does not exist or does not have the leveling system enabled.
				<Link href="/levels" className="w-fit rounded-lg bg-blurple px-2 py-1.5 transition-colors hover:bg-blurple/75">
					Take me back
				</Link>
			</p>
		</div>
	);
}
