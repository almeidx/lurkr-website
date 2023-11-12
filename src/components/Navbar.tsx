import badgeImg from "@/assets/badge.png";
import logoSmallImg from "@/assets/logo-small.png";
import { NavbarLinks } from "@/components/NavbarLinks.tsx";
import { ProfileButton } from "@/components/Profile.tsx";
import { SignInButton } from "@/components/SignIn.tsx";
import { getUserSafe } from "@/lib/auth.ts";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
	const user = getUserSafe();

	return (
		<div className="border-b border-white/25">
			<div className="mb:mx-8 mx-4 my-3 flex items-center justify-between">
				<nav className="mr-2 flex items-center gap-5 md:mr-0">
					{/* desktop logo */}
					<Link className="hidden md:flex relative items-center justify-center" href="/">
						<Image alt="Lurkr logo" className="aspect-square" height={50} priority quality={100} src={logoSmallImg} />

						<div className="absolute inset-5 bg-gradient-radial-blur blur-xl" />
					</Link>

					<div className="hidden md:block h-6 border-r border-white/25" />

					<NavbarLinks />
				</nav>

				{/* mobile logo */}
				<Link className="md:hidden" href="/">
					<Image alt="Lurkr logo" className="aspect-video" height={40} priority quality={100} src={badgeImg} />
				</Link>

				{user ? <ProfileButton {...user} /> : <SignInButton />}
			</div>
		</div>
	);
}
