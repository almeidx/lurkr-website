"use client";

import { LurkrLogo } from "@/components/icons/lurkr-logo.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cx } from "@/lib/utils.ts";
import { SIGN_IN_URL } from "@/utils/constants.ts";
import useScroll from "@/utils/use-scroll";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React from "react";

export function Navigation() {
	const scrolled = useScroll(15);
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const mediaQuery = window.matchMedia("only screen and (min-width: 768px)");

		function handleMediaQueryChange() {
			setOpen(false);
		}

		mediaQuery.addEventListener("change", handleMediaQueryChange);
		handleMediaQueryChange();

		return () => {
			mediaQuery.removeEventListener("change", handleMediaQueryChange);
		};
	}, []);

	return (
		<header
			className={cx(
				"fixed inset-x-3 top-4 z-50 mx-auto flex max-w-6xl transform-gpu animate-slide-down-fade justify-center overflow-hidden rounded-xl border border-transparent px-3 py-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform",
				open === true ? "h-64" : "h-16",
				scrolled || open === true
					? "max-w-3xl border-gray-100 bg-white/80 shadow-black/5 shadow-xl backdrop-blur-nav dark:border-white/15 dark:bg-black/80"
					: "bg-white/0 dark:bg-gray-950/0",
			)}
		>
			<div className="w-full md:my-auto">
				<div className="relative flex items-center justify-between">
					<Link href="/home" aria-label="Home">
						<span className="sr-only">Lurkr image</span>
						<LurkrLogo className="w-28 md:w-32" />
					</Link>

					<nav className="md:-translate-x-1/2 md:-translate-y-1/2 hidden md:absolute md:top-1/2 md:left-1/2 md:block md:transform">
						<div className="flex items-center gap-10 font-medium">
							<Link className="px-2 py-1 text-gray-900 dark:text-gray-50" href="/home">
								About
							</Link>
							<Link className="px-2 py-1 text-gray-900 dark:text-gray-50" href="/premium">
								Pricing
							</Link>
							<Link className="px-2 py-1 text-gray-900 dark:text-gray-50" href="/docs/changelog">
								Changelog
							</Link>
						</div>
					</nav>

					<Button className="hidden h-10 font-semibold md:flex" type="button" asChild>
						<Link href={SIGN_IN_URL}>Login</Link>
					</Button>

					<div className="flex gap-x-2 md:hidden">
						<Button type="button" asChild>
							<Link href={SIGN_IN_URL}>Login</Link>
						</Button>

						<Button variant="light" type="button" onClick={() => setOpen(!open)} className="aspect-square p-2">
							{open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
						</Button>
					</div>
				</div>

				<nav className={cx("my-6 flex text-lg ease-in-out will-change-transform md:hidden", open ? "" : "hidden")}>
					<ul className="space-y-4 font-medium">
						<li>
							<Link
								href="/home"
								className="block w-full py-2 text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
								onClick={() => setOpen(false)}
							>
								About
							</Link>
						</li>

						<li>
							<Link
								href="/premium"
								className="block w-full py-2 text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
								onClick={() => setOpen(false)}
							>
								Pricing
							</Link>
						</li>

						<li>
							<Link
								href="/docs/changelog"
								className="block w-full py-2 text-gray-900 hover:text-gray-600 dark:text-gray-50 dark:hover:text-gray-300"
								onClick={() => setOpen(false)}
							>
								Changelog
							</Link>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
}
