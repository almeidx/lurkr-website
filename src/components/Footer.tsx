import { BackToTheTop } from "@/components/BackToTheTop.tsx";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { GITHUB_REPOSITORY_URL, SUPPORT_SERVER_INVITE, TOPGG_URL } from "@/shared-links.mjs";
import Link from "next/link";

export function Footer() {
	return (
		<div className="mx-4 flex justify-center border-white/25 border-t bg-transparent py-8">
			<footer className="flex w-full max-w-7xl flex-col items-center justify-between gap-6 md:flex-row md:gap-0">
				<div>
					<p className="text-sm text-white/75 sm:text-end">
						Copyright ©️ {new Date().getFullYear()} Lurkr Team. All rights reserved.
					</p>
				</div>

				<div className="flex flex-col justify-center gap-10 whitespace-nowrap xs:flex-row">
					<div>
						<p className="mb-2 font-bold">About Us</p>

						<ul className="text-sm text-white/75">
							<li>
								<ExternalLink className="block py-0.5" href={SUPPORT_SERVER_INVITE}>
									Discord
								</ExternalLink>
							</li>
							<li>
								<ExternalLink className="block py-0.5" href={GITHUB_REPOSITORY_URL}>
									GitHub
								</ExternalLink>
							</li>
							<li>
								<ExternalLink className="block py-0.5" href={`${TOPGG_URL}?source=web-footer`}>
									Vote on Us!
								</ExternalLink>
							</li>
						</ul>
					</div>

					<div>
						<p className="mb-2 font-bold">Legal</p>

						<ul className="text-sm text-white/75">
							<li>
								<Link className="block py-0.5" href="/privacy">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link className="block py-0.5" href="/terms">
									Terms & Conditions
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div>
					<BackToTheTop />
				</div>
			</footer>
		</div>
	);
}
