"use client";

import { Menu, MenuButton, MenuItem, useMenuStore } from "@ariakit/react/menu";
import { BiChevronDown } from "@react-icons/all-files/bi/BiChevronDown";
import clsx from "clsx";
import Link from "next/link";

export function NavbarTools() {
	const menu = useMenuStore();
	const menuState = menu.useState();

	return (
		<>
			<MenuButton store={menu}>
				<div className="flex items-center justify-center">
					<span>Tools</span>
					<BiChevronDown
						className={clsx("transition duration-150 ease-in-out", menuState.open ? "rotate-180" : "rotate-0")}
						size={20}
					/>
				</div>
			</MenuButton>

			<Menu className="z-[10003] w-fit rounded border border-white bg-[#232428] p-2" gutter={8} store={menu}>
				<MenuItem className="text-center">
					<Link href="/levels">Levels</Link>
				</MenuItem>
				<MenuItem className="text-center">
					<Link href="/levels/calculator">Calculator</Link>
				</MenuItem>
				<MenuItem className="text-center">
					<Link href="/status">Status</Link>
				</MenuItem>
			</Menu>
		</>
	);
}
