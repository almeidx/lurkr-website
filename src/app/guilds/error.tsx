"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Failed to load dashboard pages", error);
	}, [error]);

	return (
		<div className="mt-16 flex flex-col items-center gap-12">
			<h1 className="text-9xl font-bold tracking-widest">404</h1>
			<p className="text-center flex flex-col items-center gap-2">
				This server does not exist or you do not have access to it.
				<Link href="/guilds" className="bg-blurple px-2 py-1.5 rounded-lg w-fit hover:bg-blurple/75 transition-colors">
					Take me back
				</Link>
			</p>
		</div>
	);
}
