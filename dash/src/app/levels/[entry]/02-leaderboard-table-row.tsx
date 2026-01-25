"use client";

import { Disclosure, DisclosureContent, DisclosureProvider } from "@ariakit/react";
import dynamic from "next/dynamic";
import { userLevelResetAction } from "@/app/levels/[entry]/actions.ts";
import type { GetLevelsResponse } from "@/app/levels/[entry]/page.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { RadialProgressBar } from "@/components/RadialProgressBar.tsx";
import { type Snowflake, userAvatar } from "@/utils/discord-cdn.ts";
import { formatNumber } from "@/utils/format-number.ts";

const Confirmation = dynamic(() =>
	import("@/components/Confirmation.tsx").then((mod) => ({ default: mod.Confirmation })),
);

export function LeaderboardTableRow({ guildId, row, isManager }: LeaderboardTableRowProps) {
	async function handleResetLevelConfirm() {
		await userLevelResetAction(guildId, row.userId);
	}

	const getRankIcon = (rank: number) => {
		if (rank === 1) return "🥇";
		if (rank === 2) return "🥈";
		if (rank === 3) return "🥉";
		return null;
	};

	const rankIcon = getRankIcon(row.rank);
	const isTopThree = row.rank <= 3;

	return (
		<DisclosureProvider>
			<Disclosure className="group">
				<div
					className={`relative overflow-hidden rounded-3xl border-2 transition-all ${
						isTopThree
							? "border-white/25 bg-gradient-to-br from-white/10 via-white/5 to-white/5 shadow-2xl shadow-primary/10 backdrop-blur-sm"
							: "border-white/10 bg-white/5 backdrop-blur-sm"
					} hover:border-white/30 hover:shadow-2xl hover:shadow-primary/5`}
					style={{
						animationDelay: `${row.rank * 50}ms`,
					}}
				>
					{/* Atmospheric Overlays */}
					{isTopThree && (
						<>
							<div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent" />
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.1),transparent_60%)]" />
						</>
					)}
					<div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)]" />

					<div className="relative flex items-center gap-5 p-6">
						{/* Rank - Larger, More Prominent */}
						<div className="flex shrink-0 items-center justify-center">
							{rankIcon ? (
								<div className="text-5xl drop-shadow-2xl filter">{rankIcon}</div>
							) : (
								<div className="flex size-14 items-center justify-center rounded-2xl border-2 border-white/25 bg-gradient-to-br from-white/10 to-white/5 font-black text-lg shadow-lg">
									#{row.rank}
								</div>
							)}
						</div>

						{/* Avatar with Enhanced Styling */}
						<div className="relative shrink-0">
							<div className="absolute -inset-1 rounded-2xl bg-white/10 blur-md" />
							<ImageWithFallback
								alt={`${row.user.username} avatar`}
								className="relative size-16 rounded-2xl border-2 border-white/30 shadow-xl ring-2 ring-white/10"
								fallback={fallbackAvatarImg}
								height={64}
								src={userAvatar(row.userId, row.user.avatar, { format: "webp", size: 128 })}
								unoptimized={Boolean(row.user.avatar)}
								width={64}
							/>
						</div>

						{/* User Info - Editorial Style */}
						<div className="min-w-0 flex-1">
							<div className="flex items-baseline gap-4">
								<p className="truncate font-black text-xl tracking-tight">{row.user.username}</p>
								<span className="shrink-0 rounded-lg border border-white/20 bg-white/10 px-3 py-1 font-bold text-white/90 text-xs uppercase tracking-wider">
									Lv.{row.level}
								</span>
							</div>
							<div className="mt-2.5 flex items-center gap-5 text-sm">
								<div className="flex items-center gap-2">
									<span className="font-black text-white/90">{formatNumber(row.xp)}</span>
									<span className="font-medium text-white/40 text-xs uppercase tracking-wider">XP</span>
								</div>
								<span className="h-1 w-1 rounded-full bg-white/30" />
								<div className="hidden items-center gap-2 sm:flex">
									<span className="font-black text-white/90">{formatNumber(row.messageCount)}</span>
									<span className="font-medium text-white/40 text-xs uppercase tracking-wider">MSGS</span>
								</div>
							</div>
						</div>

						{/* Progress Circle - Enhanced */}
						<div className="shrink-0">
							<div className="rounded-2xl border border-white/10 bg-white/5 p-2 shadow-lg">
								<RadialProgressBar color={row.user.accentColour} num={row.level} percentage={row.progress} />
							</div>
						</div>
					</div>
				</div>

				<DisclosureContent
					className="mt-4 rounded-3xl border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-wrap items-start justify-between gap-8">
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
							<div className="relative overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 p-5">
								<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
								<div className="relative mb-2 font-black text-white/40 text-xs uppercase tracking-[0.15em]">
									Total XP
								</div>
								<div className="relative font-black text-2xl">{formatNumber(row.xp)}</div>
							</div>
							<div className="relative overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 p-5">
								<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
								<div className="relative mb-2 font-black text-white/40 text-xs uppercase tracking-[0.15em]">
									Messages
								</div>
								<div className="relative font-black text-2xl">{formatNumber(row.messageCount)}</div>
							</div>
							<div className="relative overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 p-5">
								<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
								<div className="relative mb-2 font-black text-white/40 text-xs uppercase tracking-[0.15em]">
									XP to Next
								</div>
								<div className="relative font-black text-2xl">{formatNumber(row.nextLevelXp - row.xp)}</div>
							</div>
							<div className="relative overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 p-5">
								<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
								<div className="relative mb-2 font-black text-white/40 text-xs uppercase tracking-[0.15em]">
									Progress
								</div>
								<div className="relative font-black text-2xl">{row.progress.toFixed(1)}%</div>
							</div>
						</div>

						{isManager && (
							<div className="flex flex-col gap-3 rounded-2xl border-2 border-danger/30 bg-gradient-to-br from-danger/20 to-danger/10 p-5">
								<p className="font-black text-danger text-xs uppercase tracking-[0.2em]">Admin Actions</p>
								<Confirmation
									buttonText="Reset Level"
									className="w-fit rounded-xl border-2 border-danger bg-danger px-4 py-2 font-bold text-sm text-white transition-all hover:bg-danger/80 hover:shadow-lg"
									onConfirm={handleResetLevelConfirm}
								>
									Are you sure you want to reset {row.user.username}'s level?
								</Confirmation>
							</div>
						)}
					</div>
				</DisclosureContent>
			</Disclosure>
		</DisclosureProvider>
	);
}

interface LeaderboardTableRowProps {
	readonly guildId: Snowflake;
	readonly row: GetLevelsResponse["levels"][number];
	readonly isManager: boolean;
}
