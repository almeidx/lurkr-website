"use client";

import { ExternalLink } from "@/components/ExternalLink.tsx";
import { Button } from "@/components/ui/button.tsx";
import { BOT_INVITE, SUPPORT_SERVER_INVITE } from "@/shared-links.js";
import Link from "next/link";

export function CallToAction() {
	const bubbles = Array.from({ length: 20 }, (_, idx) => (
		// biome-ignore lint/suspicious/noArrayIndexKey: Not relevant
		<div key={`outer-${idx}`}>
			<div className="flex size-full gap-2">
				{Array.from({ length: 41 }, (_, idx2) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Not relevant
					<div key={`inner-${idx}-${idx2}`}>
						<div className="size-5 rounded-md shadow shadow-indigo-500/20 ring-1 ring-black/5 dark:shadow-indigo-500/20 dark:ring-white/5" />
					</div>
				))}
			</div>
		</div>
	));

	return (
		<section aria-labelledby="cta-title" className="mx-auto mt-32 mb-20 max-w-6xl p-1 px-2 sm:mt-56">
			<div className="relative flex items-center justify-center">
				<div className="mask -z-10 pointer-events-none absolute select-none opacity-70" aria-hidden="true">
					<div className="flex size-full flex-col gap-2">{bubbles}</div>
				</div>

				<div className="max-w-4xl">
					<div className="flex flex-col items-center justify-center text-center">
						<div>
							<h3
								id="cta-title"
								className="inline-block bg-gradient-to-t from-gray-900 to-gray-800 bg-clip-text p-2 font-bold text-4xl text-transparent tracking-tighter md:text-6xl dark:from-gray-50 dark:to-gray-300"
							>
								Ready to get started?
							</h3>
							<p className="mx-auto mt-4 max-w-2xl text-balance text-gray-600 sm:text-lg dark:text-gray-400">
								Add Lurkr to your server and start managing your servers with ease.
							</p>
						</div>
						<div className="mt-14 w-full rounded-[16px] bg-gray-300/5 p-1.5 ring-1 ring-black/[3%] backdrop-blur dark:bg-gray-900/10 dark:ring-white/[3%]">
							<div className="rounded-xl bg-white p-4 shadow-indigo-500/10 shadow-lg ring-1 ring-black/5 dark:bg-gray-950 dark:shadow-indigo-500/10 dark:ring-white/5">
								<div className="flex justify-center gap-2">
									<Button className="h-10 w-full sm:w-fit sm:flex-none" type="button" variant="primary" asChild>
										<Link href={BOT_INVITE}>Invite Lurkr</Link>
									</Button>

									<Button className="h-10 w-full sm:w-fit sm:flex-none" type="button" variant="secondary" asChild>
										<Link href="/guilds">Manage servers</Link>
									</Button>
								</div>
							</div>
						</div>
						<p className="mt-4 text-gray-600 text-xs sm:text-sm dark:text-gray-400">
							Not sure where to start?{" "}
							<ExternalLink
								href={SUPPORT_SERVER_INVITE}
								className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-500 dark:hover:text-indigo-400"
							>
								Join the support server
							</ExternalLink>
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
