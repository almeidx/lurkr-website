"use client";

import { Briefcase, ThumbsUp } from "@gravity-ui/icons";
import { Link as HeroLink, Tooltip } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import logoImg from "@/assets/logo.webp";
import { Discord } from "@/components/icons/Discord.tsx";
import { GitHub } from "@/components/icons/GitHub.tsx";
import { BOT_INVITE, GITHUB_REPOSITORY_URL, SUPPORT_SERVER_INVITE, TOPGG_URL } from "@/shared-links.ts";

export function Footer() {
	return (
		<footer className="border-white/10 border-t bg-black/20">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10">
				<div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
					<div className="flex w-full flex-col items-start gap-4 md:w-auto">
						<Link className="flex items-center gap-3 transition-opacity hover:opacity-80" href="/">
							<Image alt="Lurkr logo" className="size-10" height={40} src={logoImg} width={40} />
							<span className="font-bold text-xl">Lurkr</span>
						</Link>
						<p className="max-w-xs text-left text-sm text-white/50">
							The ultimate Discord leveling bot. Track activity, reward engagement, and build thriving communities.
						</p>
					</div>

					<div className="grid w-full grid-cols-2 gap-6 md:flex md:w-auto md:flex-row md:gap-12">
						<div className="flex flex-col items-start gap-3">
							<p className="font-semibold text-sm text-white/70">Product</p>
							<div className="flex flex-col gap-2 text-left md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-2">
								<HeroLink
									className="text-sm text-white/50 transition-colors hover:text-white"
									href={BOT_INVITE}
									rel="external noopener noreferrer"
									target="_blank"
								>
									Invite
								</HeroLink>
								<Link className="text-sm text-white/50 transition-colors hover:text-white" href="/docs/changelog">
									Changelog
								</Link>
								<Link className="text-sm text-white/50 transition-colors hover:text-white" href="/docs">
									Docs
								</Link>
								<Link className="text-sm text-white/50 transition-colors hover:text-white" href="/status">
									Status
								</Link>
							</div>
						</div>

						<div className="flex flex-col items-start gap-3">
							<p className="font-semibold text-sm text-white/70">Legal</p>
							<div className="flex flex-col gap-2 text-left">
								<Link className="text-sm text-white/50 transition-colors hover:text-white" href="/privacy">
									Privacy
								</Link>
								<Link className="text-sm text-white/50 transition-colors hover:text-white" href="/terms">
									Terms
								</Link>
							</div>
						</div>
					</div>

					<div className="flex w-full items-center justify-start gap-3 md:w-auto">
						<Tooltip>
							<Tooltip.Trigger>
								<HeroLink
									className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-all hover:bg-[#5865F2]/20 hover:text-[#5865F2]"
									href={SUPPORT_SERVER_INVITE}
									rel="external noopener noreferrer"
									target="_blank"
								>
									<Discord aria-label="Discord" className="size-5" />
								</HeroLink>
							</Tooltip.Trigger>
							<Tooltip.Content>Discord</Tooltip.Content>
						</Tooltip>
						<Tooltip>
							<Tooltip.Trigger>
								<HeroLink
									className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
									href={GITHUB_REPOSITORY_URL}
									rel="external noopener noreferrer"
									target="_blank"
								>
									<GitHub aria-label="GitHub" className="size-5" />
								</HeroLink>
							</Tooltip.Trigger>
							<Tooltip.Content>GitHub</Tooltip.Content>
						</Tooltip>
						<Tooltip>
							<Tooltip.Trigger>
								<HeroLink
									className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-all hover:bg-[#FF3366]/20 hover:text-[#FF3366]"
									href={`${TOPGG_URL}&utm_campaign=footer`}
									rel="external noopener noreferrer"
									target="_blank"
								>
									<ThumbsUp aria-label="Vote on Top.gg" className="size-5" />
								</HeroLink>
							</Tooltip.Trigger>
							<Tooltip.Content>Vote on Top.gg</Tooltip.Content>
						</Tooltip>
						<Tooltip>
							<Tooltip.Trigger>
								<HeroLink
									className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
									href="https://forms.gle/CMBktm14LfnyekbQ9"
									rel="external noopener noreferrer"
									target="_blank"
								>
									<Briefcase aria-label="Backend developer application" className="size-5" />
								</HeroLink>
							</Tooltip.Trigger>
							<Tooltip.Content>Backend developer application</Tooltip.Content>
						</Tooltip>
					</div>
				</div>

				<div className="h-px w-full bg-white/10" />

				<p className="text-center text-white/40 text-xs">
					© {new Date().getFullYear()} Lurkr Team. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
