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
					className={`relative overflow-hidden rounded-2xl border transition-all ${
						isTopThree
							? "border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/5 shadow-lg shadow-primary/5"
							: "border-white/10 bg-white/5"
					} hover:border-white/30 hover:shadow-xl`}
				>
					{isTopThree && (
						<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
					)}
					<div className="relative flex items-center gap-4 p-5">
						{/* Rank */}
						<div className="flex shrink-0 items-center justify-center">
							{rankIcon ? (
								<div className="text-4xl drop-shadow-lg">{rankIcon}</div>
							) : (
								<div className="flex size-12 items-center justify-center rounded-xl border-2 border-white/20 bg-white/10 font-bold text-base shadow-sm">
									#{row.rank}
								</div>
							)}
						</div>

						{/* Avatar */}
						<ImageWithFallback
							alt={`${row.user.username} avatar`}
							className="size-14 shrink-0 rounded-2xl border-2 border-white/20 shadow-md ring-2 ring-white/10"
							fallback={fallbackAvatarImg}
							height={56}
							src={userAvatar(row.userId, row.user.avatar, { format: "webp", size: 128 })}
							unoptimized={Boolean(row.user.avatar)}
							width={56}
						/>

						{/* User Info */}
						<div className="min-w-0 flex-1">
							<div className="flex items-baseline gap-3">
								<p className="truncate font-bold text-lg">{row.user.username}</p>
								<span className="shrink-0 rounded-md bg-white/10 px-2 py-0.5 font-semibold text-white/80 text-xs">
									Level {row.level}
								</span>
							</div>
							<div className="mt-2 flex items-center gap-4 text-sm text-white/60">
								<span className="font-medium">{formatNumber(row.xp)} XP</span>
								<span className="hidden sm:inline">•</span>
								<span className="hidden sm:inline">{formatNumber(row.messageCount)} messages</span>
							</div>
						</div>

						{/* Progress Circle */}
						<div className="shrink-0">
							<RadialProgressBar color={row.user.accentColour} num={row.level} percentage={row.progress} />
						</div>
					</div>
				</div>

				<DisclosureContent
					className="rounded-2xl border border-white/10 bg-white/5 p-6"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-wrap items-start justify-between gap-6">
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
							<div className="rounded-xl border border-white/10 bg-white/5 p-4">
								<div className="mb-1 font-medium text-white/40 text-xs uppercase tracking-wider">Total XP</div>
								<div className="font-bold text-xl">{formatNumber(row.xp)}</div>
							</div>
							<div className="rounded-xl border border-white/10 bg-white/5 p-4">
								<div className="mb-1 font-medium text-white/40 text-xs uppercase tracking-wider">Messages</div>
								<div className="font-bold text-xl">{formatNumber(row.messageCount)}</div>
							</div>
							<div className="rounded-xl border border-white/10 bg-white/5 p-4">
								<div className="mb-1 font-medium text-white/40 text-xs uppercase tracking-wider">XP to Next</div>
								<div className="font-bold text-xl">{formatNumber(row.nextLevelXp - row.xp)}</div>
							</div>
							<div className="rounded-xl border border-white/10 bg-white/5 p-4">
								<div className="mb-1 font-medium text-white/40 text-xs uppercase tracking-wider">Progress</div>
								<div className="font-bold text-xl">{row.progress.toFixed(1)}%</div>
							</div>
						</div>

						{isManager && (
							<div className="flex flex-col gap-3 rounded-xl border border-danger/20 bg-danger/10 p-4">
								<p className="font-semibold text-danger text-sm uppercase tracking-wider">Admin Actions</p>
								<Confirmation
									buttonText="Reset Level"
									className="w-fit rounded-lg bg-danger px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-danger/80"
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
