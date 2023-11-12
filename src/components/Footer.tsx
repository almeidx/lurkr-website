import { BackToTheTop } from "@/components/BackToTheTop.tsx";
import Link from "next/link";

export function Footer() {
	return (
		<div className="mx-4 flex justify-center border-t border-white/25 bg-transparent py-8">
			<footer className="flex w-full max-w-7xl flex-col items-center justify-between gap-6 md:flex-row md:gap-0">
				<div>
					<p className="whitespace-nowrap text-end text-sm text-white/75">
						Copyright ©️ {new Date().getFullYear()} Lurkr Team. All rights reserved.
					</p>
				</div>

				<div className="flex items-center justify-center gap-10 whitespace-nowrap">
					<div>
						<p className="font-bold">About Us</p>
						<ul className="text-sm text-white/75">
							<li>
								<a href="https://discord.gg/XUQAnkq2vy" rel="external noopener noreferrer" target="_blank">
									Discord
								</a>
							</li>
							<li>
								<a href="https://github.com/almeidx/lurkr-website" rel="external noopener noreferrer" target="_blank">
									GitHub
								</a>
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
