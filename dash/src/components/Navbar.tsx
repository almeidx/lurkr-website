"use client";

import { Button, CloseButton, Separator } from "@heroui/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PropsWithChildren, useEffect, useState } from "react";
import { Drawer } from "vaul";
import logoSmallImg from "@/assets/logo-small.webp";
import { ArrowBackIos } from "@/components/icons/mdi/arrow-back-ios.tsx";
import { AutoStories } from "@/components/icons/mdi/auto-stories.tsx";
import { Calculate } from "@/components/icons/mdi/calculate.tsx";
import { Dashboard } from "@/components/icons/mdi/dashboard.tsx";
import { EmojiEmotions } from "@/components/icons/mdi/emoji-emotions.tsx";
import { FormatListBulleted } from "@/components/icons/mdi/format-list-bulleted.tsx";
import { Menu } from "@/components/icons/mdi/menu.tsx";
import { MiscellaneousServices } from "@/components/icons/mdi/miscellaneous-services.tsx";
import { RocketLaunch } from "@/components/icons/mdi/rocket-launch.tsx";
import { Settings } from "@/components/icons/mdi/settings.tsx";
import { SignalCellular3Bar } from "@/components/icons/mdi/signal-cellular3-bar.tsx";
import { Signpost } from "@/components/icons/mdi/signpost.tsx";
import { SmartToy } from "@/components/icons/mdi/smart-toy.tsx";
import { TrendingUp } from "@/components/icons/mdi/trending-up.tsx";
import { Warning } from "@/components/icons/mdi/warning.tsx";
import { WorkspacePremium } from "@/components/icons/mdi/workspace-premium.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";

const NAV_LINKS = [
	{ href: "/guilds", icon: Dashboard, label: "Dashboard", prefetch: false as const },
	{ href: "/levels", icon: TrendingUp, label: "Levels" },
	{ href: "/levels/calculator", icon: Calculate, label: "Calculator" },
	{ href: "/status", icon: SignalCellular3Bar, label: "Status", prefetch: false as const },
	{ href: "/premium", icon: WorkspacePremium, label: "Premium", prefetch: false as const },
	{ href: "/docs", icon: AutoStories, label: "Docs", prefetch: false as const },
];

const DASHBOARD_LINKS = [
	{ icon: Settings, label: "Overview", path: "" },
	{ icon: TrendingUp, label: "Leveling", path: "leveling" },
	{ icon: SmartToy, label: "Import Bots", path: "import" },
	{ icon: RocketLaunch, label: "Multipliers", path: "multipliers" },
	{ icon: FormatListBulleted, label: "Role Management", path: "roles" },
	{ icon: Signpost, label: "Milestones", path: "milestones" },
	{ icon: EmojiEmotions, label: "Emoji List", path: "emojis" },
	{ icon: MiscellaneousServices, label: "Miscellaneous", path: "miscellaneous" },
	{ icon: Warning, label: "Danger Zone", path: "danger" },
];

function getActiveNavHref(pathname: string): string | undefined {
	return NAV_LINKS.filter(({ href }) => pathname === href || pathname.startsWith(`${href}/`)).sort(
		(a, b) => b.href.length - a.href.length,
	)[0]?.href;
}

export function Navbar({ children }: PropsWithChildren) {
	const [menuOpen, setMenuOpen] = useState(false);
	const pathname = usePathname()!;

	const guildId = pathname.match(/^\/guilds\/(\d+)/)?.[1];
	const showDashboardLinks = !!guildId;
	const activeNavHref = getActiveNavHref(pathname);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Intentional
	useEffect(() => {
		setMenuOpen(false);
	}, [pathname]);

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 768px)");
		const handler = () => {
			if (mq.matches) setMenuOpen(false);
		};
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	return (
		<>
			<header className="sticky top-0 z-50 border-white/10 border-b bg-background/80 backdrop-blur-lg">
				<div className="container mx-auto flex items-center justify-between px-4 py-2.5 md:grid md:grid-cols-[1fr_auto_1fr]">
					<Link className="flex items-center gap-2.5" href="/">
						<Image alt="Lurkr logo" className="size-9" height={36} priority quality={100} src={logoSmallImg} />
						<span className="font-semibold text-lg">Lurkr</span>
					</Link>

					<nav className="hidden md:block">
						<ul className="flex items-center gap-1">
							{NAV_LINKS.map(({ href, label, prefetch }) => (
								<li key={href}>
									<Link
										className={clsx(
											"rounded-lg px-3 py-1.5 text-sm transition-colors",
											activeNavHref === href
												? "bg-white/10 text-white"
												: "text-white/60 hover:bg-white/5 hover:text-white",
										)}
										href={href}
										prefetch={prefetch}
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className="flex items-center gap-3 md:justify-end">
						<div className="hidden md:block">{children}</div>

						<Button aria-label="Open menu" className="md:hidden" onPress={() => setMenuOpen(true)} variant="ghost">
							<Menu aria-hidden className="size-5" />
						</Button>
					</div>
				</div>
			</header>

			<Drawer.Root autoFocus direction="right" modal onOpenChange={setMenuOpen} open={menuOpen}>
				<Drawer.Portal>
					<Drawer.Overlay className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm" />

					<Drawer.Content
						aria-label="Mobile navigation"
						className="fixed inset-y-0 right-0 z-101 flex w-80 max-w-[calc(100vw-3rem)] flex-col border-white/10 border-l bg-background shadow-2xl outline-none"
					>
						<Drawer.Title className="sr-only">Navigation menu</Drawer.Title>
						<Drawer.Description className="sr-only">Site navigation and user actions</Drawer.Description>

						<div className="flex items-center justify-between border-white/10 border-b px-5 py-3">
							<span className="font-semibold text-white/80">Menu</span>
							<Drawer.Close asChild>
								<CloseButton aria-label="Close menu" />
							</Drawer.Close>
						</div>

						<nav className="flex-1 overflow-y-auto px-3 py-4">
							{showDashboardLinks && guildId ? (
								<>
									<p className="mb-2 px-3 font-medium text-white/40 text-xs uppercase tracking-wider">Dashboard</p>
									<DashboardMobileLinks guildId={guildId} pathname={pathname} />
									<Separator className="my-3" />
									<p className="mb-2 px-3 font-medium text-white/40 text-xs uppercase tracking-wider">Navigation</p>
								</>
							) : null}
							<MobileNavLinks activeNavHref={activeNavHref} />
						</nav>

						<div className="border-white/10 border-t px-3 py-3">{children}</div>
					</Drawer.Content>
				</Drawer.Portal>
			</Drawer.Root>
		</>
	);
}

function MobileNavLinks({ activeNavHref }: { activeNavHref: string | undefined }) {
	return (
		<ul className="flex flex-col gap-0.5">
			{NAV_LINKS.map(({ href, label, icon: Icon, prefetch }) => (
				<li key={href}>
					<Link
						className={clsx(
							"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
							activeNavHref === href ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
						)}
						href={href}
						prefetch={prefetch}
					>
						<Icon aria-hidden className="size-5 shrink-0" />
						{label}
					</Link>
				</li>
			))}
		</ul>
	);
}

function DashboardMobileLinks({ guildId, pathname }: { guildId: Snowflake; pathname: string }) {
	return (
		<ul className="flex flex-col gap-0.5">
			<li>
				<Link
					className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
					href="/guilds"
					prefetch={false}
				>
					<ArrowBackIos aria-hidden className="size-5 shrink-0" />
					Back
				</Link>
			</li>
			{DASHBOARD_LINKS.map(({ path, label, icon: Icon }) => {
				const href = `/guilds/${guildId}${path ? `/${path}` : ""}`;
				const isActive = pathname === href;

				return (
					<li key={path || "overview"}>
						<Link
							className={clsx(
								"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
								isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
							)}
							href={href}
						>
							<Icon aria-hidden className="size-5 shrink-0" />
							{label}
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
