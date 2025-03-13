import { ThemeSwitcher } from "@/components/clap/theme-switcher.tsx";
import { LurkrLogo } from "@/components/icons/lurkr-logo.tsx";
import { BOT_INVITE, GITHUB_REPOSITORY_URL, SUPPORT_SERVER_INVITE } from "@/shared-links.js";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

const navigation = {
	product: [
		{ name: "Pricing", href: "/premium", external: false },
		{ name: "Docs", href: "/docs", external: false },
		{ name: "Changelog", href: "/docs/changelog", external: false },
	],
	resources: [
		{ name: "Invite", href: BOT_INVITE, external: true },
		{ name: "GitHub", href: GITHUB_REPOSITORY_URL, external: true },
		{ name: "Discord", href: SUPPORT_SERVER_INVITE, external: true },
		{ name: "YouTube", href: "https://www.youtube.com/@CmdData0101", external: true },
	],
	developers: [
		/* { name: "About", href: "/about", external: false }, */
		{ name: "Contact", href: SUPPORT_SERVER_INVITE, external: true },
		{ name: "Status", href: "/status", external: false },
	],
	legal: [
		{ name: "Privacy", href: "/privacy", external: false },
		{ name: "Terms", href: "/terms", external: false },
	],
} as const;

export function Footer() {
	return (
		<footer id="footer">
			<div className="mx-auto max-w-6xl px-3 pt-16 pb-8 sm:pt-24 lg:pt-32">
				<div className="xl:grid xl:grid-cols-3 xl:gap-20">
					<div className="space-y-8">
						<LurkrLogo className="w-32 sm:w-40" />

						<p className="text-gray-600 text-sm leading-6 dark:text-gray-400">
							Redefining the way your members interact with your community. Made by a global team, for a global
							audience.
						</p>

						<div className="flex space-x-6">
							<ThemeSwitcher />
						</div>

						<div />
					</div>

					<div className="mt-16 grid grid-cols-1 gap-14 sm:gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
						<div className="grid grid-cols-2 gap-8">
							<LinksContainer links={navigation.product} title="Product" />
							<LinksContainer links={navigation.resources} title="Resources" />
						</div>

						<div className="grid grid-cols-2 gap-8">
							<LinksContainer links={navigation.developers} title="Developers" />
							<LinksContainer links={navigation.legal} title="Legal" />
						</div>
					</div>
				</div>

				<div className="mt-16 flex flex-col items-center justify-between gap-4 border-gray-200 border-t pt-8 sm:mt-20 sm:flex-row lg:mt-24 dark:border-gray-800">
					<p className="text-gray-500 text-sm leading-5 dark:text-gray-400">
						&copy; {new Date().getFullYear()} Lurkr team. All rights reserved.
					</p>

					<Link
						className="rounded-full border border-gray-200 py-1 pr-2 pl-1 dark:border-gray-800"
						href="/status"
						prefetch={false}
					>
						<div className="flex items-center gap-1.5">
							<div className="relative size-4 shrink-0">
								<div className="absolute inset-px rounded-full bg-emerald-500/20 dark:bg-emerald-600/20" />
								<div className="absolute inset-1 rounded-full bg-emerald-600 dark:bg-emerald-500" />
							</div>
							<span className="text-gray-700 text-xs dark:text-gray-50">All systems operational</span>
						</div>
					</Link>
				</div>
			</div>
		</footer>
	);
}

function LinksContainer({ links, title }: { links: (typeof navigation)[keyof typeof navigation]; title: string }) {
	return (
		<div>
			<h3 className="font-semibold text-gray-900 text-sm leading-6 dark:text-gray-50">{title}</h3>

			<ul className="mt-6 space-y-4" aria-label={`Quick links ${title}`}>
				{links.map((item) => (
					<li key={item.name} className="w-fit">
						<Link
							className="flex rounded-md text-gray-500 text-sm transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
							href={item.href}
							target={item.external ? "_blank" : undefined}
							rel={item.external ? "noopener noreferrer" : undefined}
						>
							<span>{item.name}</span>
							{item.external ? (
								<div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
									<SquareArrowOutUpRight
										aria-hidden="true"
										className="size-full shrink-0 stroke-gray-900 dark:stroke-gray-300"
									/>
								</div>
							) : null}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
