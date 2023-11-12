"use client";

import { MdArrowBack } from "@react-icons/all-files/md/MdArrowBack";
import { MdMenu } from "@react-icons/all-files/md/MdMenu";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function NavbarLinks() {
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLUListElement>(null);
	const pathname = usePathname();

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Intended
	useEffect(() => {
		setMenuOpen(false);
	}, [pathname]);

	return (
		<>
			<button
				className="md:hidden"
				type="button"
				onClick={() => {
					setMenuOpen((state) => !state);
				}}
			>
				<MdMenu size={32} />
			</button>

			{/* dim background when menu is open */}
			<div
				className={menuOpen ? "fixed top-0 left-0 bottom-0 right-0 z-[9999] bg-black opacity-75" : "hidden"}
				aria-hidden="true"
			/>

			<ul
				className={clsx(
					"fixed md:static flex-col md:flex-row gap-5 text-base", //
					menuOpen ? "flex min-w-48 z-[99999] bg-dark-gray top-0 left-0 bottom-0 px-6 py-8" : "hidden md:flex",
				)}
				ref={menuRef}
			>
				<li className="md:hidden">
					<button type="button" onClick={() => setMenuOpen(false)}>
						<MdArrowBack size={32} />
					</button>
				</li>

				<li className="md:hidden">
					<Link href="/">Home</Link>
				</li>

				<li>
					<Link href="/guilds">Dashboard</Link>
				</li>

				<li className="">
					<a href="https://patreon.com/lurkrbot" rel="external noopener noreferrer" target="_blank">
						Patreon
					</a>
				</li>

				<li>
					<Link href="/levels">Levels</Link>
				</li>
				<li>
					<Link href="/levels/calculator">Calculator</Link>
				</li>
				<li>
					<Link href="/status">Status</Link>
				</li>

				<li className="">
					<a href="https://docs.lurkr.gg" rel="external noopener noreferrer" target="_blank">
						Docs
					</a>
				</li>
			</ul>
		</>
	);
}
