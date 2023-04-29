import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GoSignIn, GoSignOut } from "react-icons/go";
import { MdClose, MdMenu } from "react-icons/md";
import avatarImg from "~/assets/avatar.png";
import { UserContext } from "~/contexts/UserContext";
import useClickOutside from "~/hooks/useClickOutside";
import { userAvatarCdn, userDefaultAvatarCdn } from "~/utils/cdn";
import { API_BASE_URL } from "~/utils/constants";

const links = [
	{ name: "Home", url: "/" },
	{ name: "Dashboard", requireAuth: true, url: "/guilds" },
	{ name: "Levels", url: "/levels" },
	{ name: "Calculator", url: "/levels/calculator" },
	{ name: "Patreon", url: "/patreon" },
	{ name: "Docs", url: "/docs" },
	{ name: "Status", url: "/status" },
] as const satisfies readonly { name: string; requireAuth?: true; url: string }[];

export default function Navbar() {
	const router = useRouter();
	const { authenticated, avatar, discriminator, id, username } = useContext(UserContext);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => setDropdownOpen(false), [router]);

	const handleDropdownClick = useCallback(() => setDropdownOpen(!dropdownOpen), [dropdownOpen]);
	const handleClickOutside = useCallback(() => setDropdownOpen(false), []);

	useClickOutside(dropdownRef, handleClickOutside);

	return (
		<div className="bg-discord-dark w-full" ref={dropdownRef}>
			<header className="mx-auto flex max-w-5xl p-6 md:items-center xl:max-w-screen-2xl">
				<Image alt="Lurkr banner" className="mr-4" height={33} priority src={avatarImg} width={33} />

				<nav className="z-20 ml-auto md:w-full">
					<span onClick={handleDropdownClick}>
						{dropdownOpen ? (
							<MdClose className="my-1 h-6 w-6 cursor-pointer text-2xl text-white md:hidden" />
						) : (
							<MdMenu className="my-1 h-6 w-6 cursor-pointer text-2xl text-white md:hidden" />
						)}
					</span>

					<nav
						className={`${
							dropdownOpen ? "block" : "hidden"
						} bg-discord-not-quite-black absolute left-0 z-50 mt-6 w-full flex-row items-center justify-between md:relative md:mt-0 md:flex md:bg-transparent`}
					>
						<ul className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:p-0">
							{links.map((link, idx) =>
								!("requireAuth" in link) || authenticated ? (
									<li key={`${idx}-${link.name}`}>
										<Link
											className="block w-full px-4 font-normal leading-7 text-gray-300 hover:underline md:px-0 md:text-gray-400"
											href={link.url}
										>
											{link.name}
										</Link>
									</li>
								) : null,
							)}
						</ul>

						{authenticated ? (
							<div className="mx-2 mb-3 flex w-11/12 gap-2 text-white md:m-0 md:ml-auto md:w-auto">
								<Link
									className="hover:bg-discord-lighter flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-700 px-2 py-1 transition-colors focus:outline-none md:w-auto md:bg-transparent"
									href="/guilds"
								>
									<Image
										alt="Your profile picture"
										className="block rounded-full"
										height={30}
										src={avatar ? userAvatarCdn(id, avatar, 32) : userDefaultAvatarCdn(discriminator, 32)}
										// Only optimize if the image is one of the default ones
										unoptimized={Boolean(avatar)}
										width={30}
									/>
									<p>
										{username}#{discriminator}
									</p>
								</Link>

								<button
									className="flex h-auto w-10 cursor-pointer items-center justify-center rounded-md bg-gray-700 px-2 py-1 transition-colors content-[''] hover:bg-red-500 focus:outline-none md:bg-transparent"
									onClick={() => void window.open(`${API_BASE_URL}/auth/logout`, "_self")}
									type="button"
								>
									<GoSignOut className="h-5 w-5" />
								</button>
							</div>
						) : (
							<button
								className="bg-blurple mx-8 mb-3 mt-4 flex w-[85%] items-center justify-center gap-2 rounded-md px-4 py-1 text-white shadow-md transition-colors hover:bg-[#414AB9] focus:outline-none md:m-0 md:ml-auto md:w-auto"
								onClick={() => void window.open(`${API_BASE_URL}/auth`, "_self")}
								type="button"
							>
								Sign in
								<GoSignIn />
							</button>
						)}
					</nav>
				</nav>
			</header>
		</div>
	);
}
