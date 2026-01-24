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

export function PodiumRow({ data, guildId, isManager }: PodiumRowProps) {
	// Reorder: 2nd, 1st, 3rd for podium layout
	const second = data[1];
	const first = data[0];
	const third = data[2];

	// Type guard - should never happen but TypeScript needs it
	if (!second || !first || !third) {
		return null;
	}

	return (
		<div className="mb-6 grid grid-cols-3 gap-3">
			{/* 2nd Place */}
			<PodiumCard guildId={guildId} isManager={isManager} position={2} row={second} />

			{/* 1st Place - Center, Tallest */}
			<PodiumCard guildId={guildId} isManager={isManager} position={1} row={first} />

			{/* 3rd Place */}
			<PodiumCard guildId={guildId} isManager={isManager} position={3} row={third} />
		</div>
	);
}

function PodiumCard({ row, position, guildId, isManager }: PodiumCardProps) {
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
	const isFirst = position === 1;

	return (
		<DisclosureProvider>
			<Disclosure className="group flex h-full flex-col">
				<div
					className={`relative flex flex-1 flex-col overflow-hidden rounded-2xl border transition-all ${
						isFirst
							? "border-primary/30 bg-gradient-to-b from-primary/20 via-primary/10 to-white/5 shadow-2xl shadow-primary/20"
							: position === 2
								? "border-white/20 bg-gradient-to-b from-white/10 to-white/5 shadow-lg"
								: "border-white/15 bg-gradient-to-b from-white/8 to-white/5 shadow-md"
					} hover:border-white/30 hover:shadow-xl`}
				>
					{isFirst && (
						<div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
					)}
					<div className={`relative flex flex-1 flex-col items-center ${isFirst ? "p-6" : "p-4"} gap-3`}>
						{/* Rank Icon */}
						<div className="text-5xl drop-shadow-lg">{rankIcon}</div>

						{/* Avatar */}
						<ImageWithFallback
							alt={`${row.user.username} avatar`}
							className={`shrink-0 rounded-2xl border-2 border-white/20 shadow-lg ring-2 ring-white/10 ${
								isFirst ? "size-20" : "size-16"
							}`}
							fallback={fallbackAvatarImg}
							height={isFirst ? 80 : 64}
							src={userAvatar(row.userId, row.user.avatar, { format: "webp", size: 128 })}
							unoptimized={Boolean(row.user.avatar)}
							width={isFirst ? 80 : 64}
						/>

						{/* User Info */}
						<div className="flex min-w-0 flex-col items-center text-center">
							<p className={`truncate font-bold ${isFirst ? "text-lg" : "text-base"}`}>{row.user.username}</p>
							<span className="mt-1 rounded-md bg-white/10 px-2 py-0.5 font-semibold text-white/80 text-xs">
								Level {row.level}
							</span>
						</div>

						{/* Stats */}
						<div
							className={`mt-auto flex flex-col items-center gap-1 ${isFirst ? "text-sm" : "text-xs"} text-white/60`}
						>
							<span className="font-semibold">{formatNumber(row.xp)} XP</span>
							<span>{formatNumber(row.messageCount)} msgs</span>
						</div>

						{/* Progress Circle */}
						<div className="shrink-0">
							<RadialProgressBar color={row.user.accentColour} num={row.level} percentage={row.progress} />
						</div>
					</div>
				</div>

				<DisclosureContent
					className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="grid grid-cols-2 gap-2">
						<div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
							<div className="font-medium text-white/40 text-xs uppercase tracking-wider">Total XP</div>
							<div className="mt-0.5 font-bold">{formatNumber(row.xp)}</div>
						</div>
						<div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
							<div className="font-medium text-white/40 text-xs uppercase tracking-wider">Messages</div>
							<div className="mt-0.5 font-bold">{formatNumber(row.messageCount)}</div>
						</div>
						<div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
							<div className="font-medium text-white/40 text-xs uppercase tracking-wider">XP to Next</div>
							<div className="mt-0.5 font-bold">{formatNumber(row.nextLevelXp - row.xp)}</div>
						</div>
						<div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
							<div className="font-medium text-white/40 text-xs uppercase tracking-wider">Progress</div>
							<div className="mt-0.5 font-bold">{row.progress.toFixed(1)}%</div>
						</div>
					</div>

					{isManager && (
						<div className="mt-4 flex flex-col gap-2 rounded-lg border border-danger/20 bg-danger/10 p-3">
							<p className="font-semibold text-danger text-xs uppercase tracking-wider">Admin</p>
							<Confirmation
								buttonText="Reset Level"
								className="w-fit rounded-lg bg-danger px-3 py-1.5 font-medium text-white text-xs transition-colors hover:bg-danger/80"
								onConfirm={handleResetLevelConfirm}
							>
								Are you sure you want to reset {row.user.username}'s level?
							</Confirmation>
						</div>
					)}
				</DisclosureContent>
			</Disclosure>
		</DisclosureProvider>
	);
}

interface PodiumRowProps {
	readonly data: GetLevelsResponse["levels"];
	readonly guildId: Snowflake;
	readonly isManager: boolean;
}

interface PodiumCardProps {
	readonly guildId: Snowflake;
	readonly isManager: boolean;
	readonly position: 1 | 2 | 3;
	readonly row: GetLevelsResponse["levels"][number];
}
