import "./(dashboard)/dashboard.css";

import { CookieNoticeHandler } from "@/components/CookieNoticeHandler";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { NavbarUserButton } from "@/components/NavbarUserButton";
import { PreviewWarning } from "@/components/PreviewWarning";
import { SignInButton } from "@/components/SignIn";
import { Text } from "@/components/dashboard/Text.tsx";
import { SvgGradients } from "@/components/svg-gradients";
import Link from "next/link";
import { Suspense } from "react";
import { openSans } from "./fonts";
import { Providers } from "./providers";

const isPreview = process.env.ENVIRONMENT !== "prod" && process.env.NODE_ENV !== "development";

export default function NotFound() {
	return (
		// Moving this into the (dashboard) group doesn't work due to multiple root layouts.
		// We're essentially remaking the root layout here as well.
		<div
			className={`${openSans.variable} flex min-h-screen flex-col scroll-smooth bg-background font-sans text-white antialiased selection:bg-primary selection:text-white`}
		>
			<Providers>
				<div className="flex-1">
					<Navbar>
						<Suspense fallback={<SignInButton />}>
							<NavbarUserButton />
						</Suspense>
					</Navbar>

					<div className="mt-16 flex flex-col items-center gap-4">
						<h1 className="font-bold text-9xl tracking-widest">404</h1>
						<Text>Whoops… Page not found.</Text>

						<Link href="/" className="rounded-md bg-blurple px-4 py-2 hover:bg-blurple/80">
							Go back home
						</Link>
					</div>
				</div>

				<CookieNoticeHandler />
			</Providers>

			{isPreview && <PreviewWarning />}

			<Footer />

			<SvgGradients />
		</div>
	);
}
