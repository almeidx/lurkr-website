import Link from "next/link";
import type { PropsWithChildren } from "react";

export function UnknownGuildOrMissingAccess({ children }: PropsWithChildren) {
	return (
		<div className="mt-16 flex flex-col items-center gap-12">
			<h1 className="font-bold text-9xl tracking-widest">404</h1>
			<p className="flex flex-col items-center gap-2 text-center">
				This server does not exist or you do not have access to it.
				<Link
					className="w-fit rounded-lg bg-blurple px-2 py-1.5 transition-colors hover:bg-blurple/75"
					href="/guilds"
					prefetch={false}
				>
					Take me back
				</Link>
			</p>

			{children}
		</div>
	);
}
