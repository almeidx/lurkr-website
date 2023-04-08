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
	{ name: "Tutorials", url: "/tutorials" },
	{ name: "Docs", url: "/docs" },
	{ name: "Status", url: "/status" },
] satisfies { name: string; requireAuth?: boolean; url: string }[];

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
						} bg-discord-not-quite-black absolute left-0 z-50 mt-6 w-full md:relative md:mt-0 md:block md:bg-transparent`}
					>
						<ul className="flex flex-col gap-4 py-4 pr-4 md:flex-row md:items-center md:p-0">
							{links.map(
								({ name, requireAuth, url }, idx) =>
									(!requireAuth || authenticated) && (
										<li key={idx}>
											<Link
												className="block w-full px-4 font-normal leading-7 text-gray-300 hover:underline md:px-0 md:text-gray-400"
												href={url}
											>
												{name}
											</Link>
										</li>
									),
							)}

							{authenticated ? (
								<div className="mx-2 mt-6 flex flex-row gap-2 text-white md:mx-0 md:ml-auto md:mt-0">
									<Link
										className="hover:bg-discord-lighter flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-gray-700 px-2 py-1 duration-200 focus:outline-none md:bg-transparent"
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
										className="flex h-auto w-10 cursor-pointer items-center justify-center rounded-md bg-gray-700 px-2 py-1 duration-200 content-none hover:bg-red-500 focus:outline-none md:bg-transparent"
										onClick={(event) => {
											event.preventDefault();
											window.open(`${API_BASE_URL}/auth/logout`, "_self");
										}}
										type="button"
									>
										<GoSignOut className="h-5 w-5" />
									</button>
								</div>
							) : (
								<button
									className="bg-blurple mx-2 mt-6 flex flex-row items-center justify-center gap-2 rounded-md px-2 py-1 text-white shadow-md transition-colors duration-100 hover:bg-[#414AB9] focus:outline-none md:mx-0 md:ml-auto md:mt-0"
									onClick={(event) => {
										event.preventDefault();
										window.open(`${API_BASE_URL}/auth`, "_self");
									}}
									type="button"
								>
									Sign in
									<GoSignIn />
								</button>
							)}
						</ul>
					</nav>
				</nav>
			</header>
		</div>
	);
}
