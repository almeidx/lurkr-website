import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GoSignIn, GoSignOut } from "react-icons/go";
import { MdClose, MdMenu } from "react-icons/md";
import { UserContext } from "../contexts/UserContext";
import useClickOutside from "../hooks/useClickOutside";
import { userAvatarCdn, userDefaultAvatarCdn } from "../utils/cdn";
import { API_BASE_URL } from "../utils/constants";

const links: { name: string; requireAuth?: boolean; url: string }[] = [
	{
		name: "Home",
		url: "/",
	},
	{
		name: "Dashboard",
		requireAuth: true,
		url: "/guilds",
	},
	{
		name: "Levels",
		url: "/levels",
	},
	{
		name: "Calculator",
		url: "/levels/calculator",
	},
	{
		name: "Tutorials",
		url: "/tutorials",
	},
	{
		name: "Docs",
		url: "/docs",
	},
	{
		name: "Status",
		url: "/status",
	},
];

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
		<div className="w-full bg-discord-dark" ref={dropdownRef}>
			<header className="mx-auto flex max-w-[992px] p-6 md:items-center xl:max-w-[1440px]">
				<Link className=" mr-4 whitespace-nowrap py-1 font-bold uppercase text-white md:p-0 md:text-xl" href="/">
					Pepe Manager
				</Link>

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
						} absolute left-0 z-50 mt-6 w-full bg-discord-not-quite-black md:relative md:mt-0 md:block md:bg-transparent`}
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
								<div className="mx-2 mt-6 flex flex-row gap-2 text-white md:mx-0 md:mt-0 md:ml-auto">
									<Link
										className="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-md bg-gray-700 py-1 px-2 duration-200 hover:bg-discord-lighter focus:outline-none md:bg-transparent"
										href="/guilds"
									>
										<Image
											alt="Your profile picture"
											className="block rounded-full"
											height={30}
											src={avatar ? userAvatarCdn(id, avatar, 32) : userDefaultAvatarCdn(discriminator, 32)}
											width={30}
										/>
										<p>
											{username}#{discriminator}
										</p>
									</Link>

									<button
										className="flex h-auto w-10 cursor-pointer items-center justify-center rounded-md bg-gray-700 py-1 px-2 duration-200 content-none hover:bg-red-500 focus:outline-none md:bg-transparent"
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
									className="mx-2 mt-6 flex flex-row items-center justify-center gap-2 rounded-md bg-blurple py-1 px-2 text-white shadow-md transition-colors duration-100 hover:bg-[#414AB9] focus:outline-none md:mx-0 md:mt-0 md:ml-auto"
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
