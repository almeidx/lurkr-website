"use client";

import logoSmallImg from "@/assets/logo-small.webp";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { ArrowBackIos } from "@/components/icons/mdi/arrow-back-ios.tsx";
import { AutoStories } from "@/components/icons/mdi/auto-stories.tsx";
import { Calculate } from "@/components/icons/mdi/calculate.tsx";
import { Dashboard } from "@/components/icons/mdi/dashboard.tsx";
import { EmojiEmotions } from "@/components/icons/mdi/emoji-emotions.tsx";
import { FormatListBulleted } from "@/components/icons/mdi/format-list-bulleted.tsx";
import { MenuOpen } from "@/components/icons/mdi/menu-open.tsx";
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
import { DOCS_URL } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PropsWithChildren, useEffect, useState } from "react";

export function Navbar({ children }: PropsWithChildren) {
	const [menuOpen, setMenuOpen] = useState(false);
	const pathname = usePathname()!;

	const isDashboard = pathname.startsWith("/guilds") && pathname.length > "/guilds/".length;
	const guildId = isDashboard ? pathname.match(/^\/guilds\/(\d+)/)?.[1] : null;

	const showMobileDashboardNavbar = isDashboard && !!guildId;

	// biome-ignore lint/correctness/useExhaustiveDependencies: Intentional
	useEffect(() => {
		setMenuOpen(false);
	}, [pathname]);

	function handleMenuClick() {
		setMenuOpen((prev) => !prev);
	}

	function handleMenuClose() {
		setMenuOpen(false);
	}

	return (
		<header className="mx-4 mt-4 flex max-w-7xl items-center justify-between rounded-lg border border-white/25 px-4 py-1 xl:mx-auto">
			<Link
				className={clsx("flex flex-1 items-center gap-2", menuOpen ? "fixed top-5 left-8 z-[100000]" : "")}
				href="/"
			>
				<Image alt="Lurkr logo" className="size-[45px]" height={45} priority quality={100} src={logoSmallImg} />

				<p className="font-medium text-xl">Lurkr</p>
			</Link>

			<nav
				className={clsx(
					"fixed inset-0 z-[99999] flex flex-1 items-center justify-center bg-background md:static md:block md:bg-transparent",
					menuOpen ? "block" : "hidden",
				)}
			>
				<button
					className={clsx("fixed top-8 right-8 z-[99999] md:z-0 md:hidden")}
					onClick={handleMenuClose}
					aria-label="Close menu"
					type="button"
				>
					<MenuOpen className="size-6" />
				</button>

				{guildId ? <DashboardMobileNavbarLinks guildId={guildId} show={showMobileDashboardNavbar} /> : null}

				<NavbarLinks hideMobile={showMobileDashboardNavbar} />
			</nav>

			<div
				className={clsx(
					"flex-1 md:flex md:flex-row-reverse",
					menuOpen ? "-translate-x-1/2 fixed bottom-7 left-1/2 z-[100000] bg-black/50" : "hidden",
				)}
			>
				{children}
			</div>

			<button className="md:hidden" onClick={handleMenuClick} aria-label="Open menu" type="button">
				<Menu className="size-6" />
			</button>
		</header>
	);
}

function NavbarLinks({ hideMobile }: { hideMobile?: boolean }) {
	return (
		<ul
			className={clsx(
				"flex-col gap-5 text-xl md:flex-row md:items-baseline md:text-base",
				hideMobile ? "hidden md:flex" : "flex",
			)}
		>
			<li className="text-white hover:text-white/75">
				<Link href="/guilds" className="flex items-center gap-2">
					<div className="md:hidden">
						<Dashboard />
					</div>
					Dashboard
				</Link>
			</li>
			<li className="flex items-center gap-2 text-white hover:text-white/75">
				<Link href="/levels" className="flex items-center gap-2">
					<div className="md:hidden">
						<TrendingUp />
					</div>
					Levels
				</Link>
			</li>
			<li className="flex items-center gap-2 text-white hover:text-white/75">
				<Link href="/levels/calculator" className="flex items-center gap-2">
					<div className="md:hidden">
						<Calculate />
					</div>
					Calculator
				</Link>
			</li>
			<li className="flex items-center gap-2 text-white hover:text-white/75">
				<Link href="/status" prefetch={false} className="flex items-center gap-2">
					<div className="md:hidden">
						<SignalCellular3Bar />
					</div>
					Status
				</Link>
			</li>
			<li className="flex items-center gap-2 text-white hover:text-white/75">
				<Link href="/premium" prefetch={false} className="flex items-center gap-2">
					<div className="md:hidden">
						<WorkspacePremium />
					</div>
					Premium
				</Link>
			</li>
			<li className="flex items-center gap-2 text-white hover:text-white/75">
				<ExternalLink href={DOCS_URL} className="flex items-center gap-2">
					<div className="md:hidden">
						<AutoStories />
					</div>
					Docs
				</ExternalLink>
			</li>
		</ul>
	);
}

function DashboardMobileNavbarLinks({ guildId, show }: { guildId: Snowflake; show: boolean }) {
	return (
		<ul className={clsx("flex-col gap-5 text-xl md:flex-row md:items-baseline md:text-base", show && "flex md:hidden")}>
			<li className="text-white hover:text-white/75">
				<Link href="/guilds" className="flex items-center gap-2">
					<ArrowBackIos />
					Back
				</Link>
			</li>
			<li className="text-white hover:text-white/75">
				<Link href={`/guilds/${guildId}`} className="flex items-center gap-2">
					<Settings />
					Overview
				</Link>
			</li>
			<li className="text-white hover:text-white/75">
				<Link href={`/guilds/${guildId}/leveling`} className="flex items-center gap-2">
					<TrendingUp className="text-[#ff7077]" />
					Leveling
				</Link>
			</li>
			<li className="text-white hover:text-white/75">
				<Link href={`/guilds/${guildId}/import`} className="flex items-center gap-2">
					<SmartToy />
					Import Bots
				</Link>
			</li>
			<li className="text-white hover:text-white/75">
				<Link href={`/guilds/${guildId}/multipliers`} className="flex items-center gap-2">
					<RocketLaunch className="text-[#82cbff]" />
					Multipliers
				</Link>
			</li>
			<li className="text-white hover:text-white/75">
				<Link href={`/guilds/${guildId}/roles`} className="flex items-center gap-2">
					<FormatListBulleted className="text-[#d2ffae]" />
					Role Management
				</Link>
			</li>
			<li className="text-white hover:text-white/75">
				<Link href={`/guilds/${guildId}/milestones`} className="flex items-center gap-2">
					<Signpost className="text-[#804994]" />
					Milestones
				</Link>
			</li>
			<li className="text-white hover:text-white/75">
				<Link href={`/guilds/${guildId}/emojis`} className="flex items-center gap-2">
					<EmojiEmotions className="text-[#ffe87c]" />
					Emoji List
				</Link>
			</li>
			<li className="text-white hover:text-white/75">
				<Link href={`/guilds/${guildId}/miscellaneous`} className="flex items-center gap-2">
					<MiscellaneousServices className="text-[#73ffc4]" />
					Miscellaneous
				</Link>
			</li>
			<li className="text-white hover:text-white/75">
				<Link href={`/guilds/${guildId}/danger`} className="flex items-center gap-2">
					<Warning className="text-[#ff9254]" />
					Danger Zone
				</Link>
			</li>
		</ul>
	);
}
