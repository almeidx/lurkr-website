"use client";

import logoSmallImg from "@/assets/logo-small.webp";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { DOCS_URL } from "@/utils/constants.ts";
import { ArrowBackIos, Menu, MenuOpen } from "@mui/icons-material";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PropsWithChildren, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export function Navbar({ children }: PropsWithChildren) {
	const [menuOpen, setMenuOpen] = useState(false);
	const pathname = usePathname()!;
	// TODO: Use css only for this instead of js
	const isMedium = useMediaQuery("(max-width: 768px)");

	const isDashboard = pathname.startsWith("/guilds") && pathname.length > "/guilds/".length;
	const guildId = isDashboard ? pathname.match(/^\/guilds\/(\d+)/)?.[1] : null;

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
			<Link className={clsx("flex items-center gap-2", menuOpen ? "fixed top-5 left-8 z-[100000]" : "")} href="/">
				<Image alt="Lurkr logo" className="size-[45px]" height={45} priority quality={100} src={logoSmallImg} />

				<p className="font-medium text-xl">Lurkr</p>
			</Link>

			<nav
				className={clsx(
					"fixed inset-0 z-[99999] flex items-center justify-center bg-background md:static md:block md:bg-transparent",
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

				<ul className="flex flex-col items-center gap-5 text-xl md:flex-row md:items-baseline md:text-base">
					{isMedium && isDashboard && guildId ? (
						<>
							<li className="text-white hover:text-white/75">
								<Link href="/guilds" className="flex items-center">
									<ArrowBackIos />
									Back
								</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href={`/guilds/${guildId}`}>Overview</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href={`/guilds/${guildId}/leveling`}>Leveling</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href={`/guilds/${guildId}/import`}>Import Bots</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href={`/guilds/${guildId}/multipliers`}>Multipliers</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href={`/guilds/${guildId}/roles`}>Role Management</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href={`/guilds/${guildId}/milestones`}>Milestones</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href={`/guilds/${guildId}/emojis`}>Emoji List</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href={`/guilds/${guildId}/miscellaneous`}>Miscellaneous</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href={`/guilds/${guildId}/danger`}>Danger Zone</Link>
							</li>
						</>
					) : (
						<>
							<li className="text-white hover:text-white/75">
								<Link href="/guilds">Dashboard</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href="/levels">Levels</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href="/levels/calculator">Calculator</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href="/status" prefetch={false}>
									Status
								</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href="/premium">Premium</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<ExternalLink href={DOCS_URL}>Docs</ExternalLink>
							</li>
						</>
					)}
				</ul>
			</nav>

			<div
				className={clsx(
					"md:block",
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
