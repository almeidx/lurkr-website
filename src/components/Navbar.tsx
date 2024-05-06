"use client";

import logoSmallImg from "@/assets/logo-small.png";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { ProfileButton } from "@/components/Profile.tsx";
import { SignInButton } from "@/components/SignIn.tsx";
import type { getUserSafe } from "@/lib/auth.ts";
import { DOCS_URL } from "@/utils/constants.ts";
import { MdArrowBackIos } from "@react-icons/all-files/md/MdArrowBackIos";
import { MdMenu } from "@react-icons/all-files/md/MdMenu";
import { MdMenuOpen } from "@react-icons/all-files/md/MdMenuOpen";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

export function Navbar({ user }: { readonly user: ReturnType<typeof getUserSafe> }) {
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
		<header className="flex justify-between items-center border border-white/25 rounded-lg max-w-7xl mx-4 xl:mx-auto mt-4 px-4 py-1">
			<Link className={clsx("flex gap-2 items-center", menuOpen ? "z-[100000] fixed top-5 left-8" : "")} href="/">
				<Image alt="Lurkr logo" className="size-[45px]" height={45} priority quality={100} src={logoSmallImg} />

				<p className="font-medium text-xl">Lurkr</p>
			</Link>

			<nav
				className={clsx(
					"inset-0 flex items-center justify-center fixed bg-background z-[99999] md:bg-transparent md:static md:block",
					menuOpen ? "block" : "hidden",
				)}
			>
				<button
					className={clsx("fixed top-8 right-8 z-[99999] md:z-0 md:hidden")}
					onClick={handleMenuClose}
					type="button"
				>
					<MdMenuOpen size={24} />
				</button>

				<ul className="flex flex-col items-center md:items-baseline text-xl md:text-base md:flex-row gap-5">
					{isMedium && isDashboard && guildId ? (
						<>
							<li className="text-white hover:text-white/75">
								<Link href="/guilds" className="flex items-center">
									<MdArrowBackIos />
									Back
								</Link>
							</li>
							<li className="text-white hover:text-white/75">
								<Link href={`/guilds/${guildId}`}>Overview</Link>
							</li>
							{/* TODO: Re-add this once implemented */}
							{/* <li className="text-white hover:text-white/75">
								<Link href={`/guilds/${guildId}/import`}>Import Bots</Link>
							</li> */}
							<li className="text-white hover:text-white/75">
								<Link href={`/guilds/${guildId}/leveling`}>Leveling</Link>
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
					menuOpen ? "fixed bottom-7 bg-black/50 z-[100000] -translate-x-1/2 left-1/2" : "hidden",
				)}
			>
				{user ? <ProfileButton {...user} /> : <SignInButton />}
			</div>

			<button className="md:hidden" onClick={handleMenuClick} type="button">
				<MdMenu size={24} />
			</button>
		</header>
	);
}
