import { BackToTheTop } from "@/components/BackToTheTop.tsx";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import Link from "next/link";
import { GITHUB_REPOSITORY_URL, SUPPORT_SERVER_INVITE, TOPGG_URL } from "../../shared-links.mjs";

export function Footer() {
	return (
		<div className="mx-4 flex justify-center border-t border-white/25 bg-transparent py-8">
			<footer className="flex w-full max-w-7xl flex-col items-center justify-between gap-6 md:flex-row md:gap-0">
				<div>
					<p className="sm:text-end text-sm text-white/75">
						Copyright ©️ {new Date().getFullYear()} Lurkr Team. All rights reserved.
					</p>
				</div>

				<div className="flex justify-center gap-10 whitespace-nowrap">
					<div>
						<p className="font-bold">About Us</p>
						<ul className="text-sm text-white/75">
							<li>
								<ExternalLink href={SUPPORT_SERVER_INVITE}>Discord</ExternalLink>
							</li>
							<li>
								<ExternalLink href={GITHUB_REPOSITORY_URL}>GitHub</ExternalLink>
							</li>
							<li>
								<ExternalLink href={`${TOPGG_URL}?source=web-footer`}>Vote on Us!</ExternalLink>
							</li>
						</ul>
					</div>

					<div>
						<p className="font-bold">Legal</p>
						<ul className="text-sm text-white/75">
							<li>
								<Link href="/privacy">Privacy Policy</Link>
							</li>
							<li>
								<Link href="/terms">Terms & Conditions</Link>
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
