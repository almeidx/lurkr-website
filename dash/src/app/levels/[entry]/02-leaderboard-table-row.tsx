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
					className={`group relative overflow-hidden rounded-lg border transition-all ${
						isTopThree ? "border-white/20 bg-white/5" : "border-white/10 bg-white/5"
					} hover:border-white/20 hover:bg-white/10`}
				>
					{isTopThree && (
						<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />
					)}
					<div className="relative flex items-center gap-3 p-3">
						{/* Rank */}
						<div className="flex shrink-0 items-center justify-center">
							{rankIcon ? (
								<div className="text-2xl">{rankIcon}</div>
							) : (
								<div className="flex size-8 items-center justify-center rounded border border-white/20 bg-white/5 font-bold text-xs">
									{row.rank}
								</div>
							)}
						</div>

						{/* Avatar */}
						<ImageWithFallback
							alt={`${row.user.username} avatar`}
							className="size-10 shrink-0 rounded-lg border border-white/20"
							fallback={fallbackAvatarImg}
							height={40}
							src={userAvatar(row.userId, row.user.avatar, { format: "webp", size: 64 })}
							unoptimized={Boolean(row.user.avatar)}
							width={40}
						/>

						{/* User Info */}
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<p className="truncate font-semibold">{row.user.username}</p>
								<span className="shrink-0 rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-medium text-white/70 text-xs">
									Lv.{row.level}
								</span>
							</div>
							<div className="mt-1 flex items-center gap-3 text-white/50 text-xs">
								<span>{formatNumber(row.xp)} XP</span>
								<span className="hidden sm:inline">•</span>
								<span className="hidden sm:inline">{formatNumber(row.messageCount)} msgs</span>
							</div>
						</div>

						{/* Progress Circle */}
						<div className="shrink-0">
							<RadialProgressBar color={row.user.accentColour} num={row.level} percentage={row.progress} />
						</div>
					</div>
				</div>

				<DisclosureContent
					className="mt-2 rounded-lg border border-white/10 bg-white/5 p-4"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-wrap items-start justify-between gap-6">
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
							<div className="rounded border border-white/10 bg-white/5 p-3">
								<div className="mb-1 text-white/50 text-xs">Total XP</div>
								<div className="font-semibold">{formatNumber(row.xp)}</div>
							</div>
							<div className="rounded border border-white/10 bg-white/5 p-3">
								<div className="mb-1 text-white/50 text-xs">Messages</div>
								<div className="font-semibold">{formatNumber(row.messageCount)}</div>
							</div>
							<div className="rounded border border-white/10 bg-white/5 p-3">
								<div className="mb-1 text-white/50 text-xs">XP to Next</div>
								<div className="font-semibold">{formatNumber(row.nextLevelXp - row.xp)}</div>
							</div>
							<div className="rounded border border-white/10 bg-white/5 p-3">
								<div className="mb-1 text-white/50 text-xs">Progress</div>
								<div className="font-semibold">{row.progress.toFixed(1)}%</div>
							</div>
						</div>

						{isManager && (
							<div className="flex flex-col gap-2 rounded-lg border border-danger/20 bg-danger/10 p-3">
								<p className="font-semibold text-danger text-xs uppercase tracking-wider">Admin</p>
								<Confirmation
									buttonText="Reset Level"
									className="w-fit rounded bg-danger px-3 py-1.5 font-medium text-white text-xs transition-colors hover:bg-danger/80"
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
