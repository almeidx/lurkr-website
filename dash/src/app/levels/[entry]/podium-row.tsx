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
		<div className="mb-10 grid grid-cols-3 items-end gap-6">
			{/* 2nd Place - Left, Medium Height */}
			<div className="flex flex-col">
				<PodiumCard guildId={guildId} isManager={isManager} position={2} row={second} />
			</div>

			{/* 1st Place - Center, Tallest */}
			<div className="flex flex-col">
				<PodiumCard guildId={guildId} isManager={isManager} position={1} row={first} />
			</div>

			{/* 3rd Place - Right, Shortest */}
			<div className="flex flex-col">
				<PodiumCard guildId={guildId} isManager={isManager} position={3} row={third} />
			</div>
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
	const isSecond = position === 2;

	return (
		<DisclosureProvider>
			<Disclosure className="group flex h-full flex-col">
				<div
					className={`relative flex flex-col overflow-hidden rounded-3xl border-2 backdrop-blur-sm transition-all ${
						isFirst
							? "min-h-[480px] border-primary/50 bg-gradient-to-b from-primary/40 via-primary/20 to-white/5 shadow-2xl shadow-primary/40"
							: isSecond
								? "min-h-[400px] border-white/30 bg-gradient-to-b from-white/20 via-white/10 to-white/5 shadow-xl"
								: "min-h-[360px] border-white/20 bg-gradient-to-b from-white/15 via-white/8 to-white/5 shadow-lg"
					} hover:border-white/50 hover:shadow-2xl`}
				>
					{/* Atmospheric Layers */}
					{isFirst && (
						<>
							<div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.25),transparent_70%)]" />
							<div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]" />
						</>
					)}
					{isSecond && (
						<>
							<div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent" />
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]" />
						</>
					)}
					{position === 3 && (
						<div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
					)}
					<div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)]" />
					<div
						className={`relative z-10 flex flex-1 flex-col items-center ${isFirst ? "p-10" : isSecond ? "p-8" : "p-6"} gap-5`}
					>
						{/* Rank Icon - Dramatic */}
						<div className={`drop-shadow-2xl filter ${isFirst ? "text-7xl" : isSecond ? "text-6xl" : "text-5xl"}`}>
							{rankIcon}
						</div>

						{/* Avatar with Glow Effect */}
						<div className="relative">
							{isFirst && <div className="absolute -inset-3 rounded-3xl bg-primary/30 blur-2xl" />}
							<ImageWithFallback
								alt={`${row.user.username} avatar`}
								className={`relative shrink-0 rounded-3xl border-2 border-white/30 shadow-2xl ring-2 ring-white/10 ${
									isFirst ? "size-28" : isSecond ? "size-24" : "size-20"
								}`}
								fallback={fallbackAvatarImg}
								height={isFirst ? 112 : isSecond ? 96 : 80}
								src={userAvatar(row.userId, row.user.avatar, { format: "webp", size: 256 })}
								unoptimized={Boolean(row.user.avatar)}
								width={isFirst ? 112 : isSecond ? 96 : 80}
							/>
						</div>

						{/* User Info - Editorial Style */}
						<div className="flex min-w-0 flex-col items-center text-center">
							<p
								className={`truncate font-black tracking-tight ${
									isFirst ? "text-2xl" : isSecond ? "text-xl" : "text-lg"
								}`}
							>
								{row.user.username}
							</p>
							<span
								className={`mt-2 rounded-xl border-2 px-4 py-1.5 font-black uppercase tracking-wider ${
									isFirst
										? "border-primary/40 bg-primary/20 text-primary-foreground text-sm"
										: isSecond
											? "border-white/25 bg-white/15 text-white/90 text-xs"
											: "border-white/20 bg-white/10 text-white/80 text-xs"
								}`}
							>
								Level {row.level}
							</span>
						</div>

						{/* Stats - Bold Typography */}
						<div
							className={`mt-auto flex flex-col items-center gap-2 ${
								isFirst ? "text-base" : isSecond ? "text-sm" : "text-xs"
							}`}
						>
							<div className="flex items-baseline gap-2">
								<span className="font-black text-white/90">{formatNumber(row.xp)}</span>
								<span className="font-bold text-white/40 text-xs uppercase tracking-wider">XP</span>
							</div>
							<div className="flex items-baseline gap-2">
								<span className="font-black text-white/90">{formatNumber(row.messageCount)}</span>
								<span className="font-bold text-white/40 text-xs uppercase tracking-wider">MSGS</span>
							</div>
						</div>

						{/* Progress Circle - Enhanced */}
						<div className="shrink-0">
							<div className="rounded-2xl border-2 border-white/20 bg-white/5 p-3 shadow-xl">
								<RadialProgressBar color={row.user.accentColour} num={row.level} percentage={row.progress} />
							</div>
						</div>
					</div>
				</div>

				<DisclosureContent
					className="mt-4 rounded-3xl border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="grid grid-cols-2 gap-4">
						<div className="relative overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 p-4">
							<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
							<div className="relative mb-2 font-black text-white/40 text-xs uppercase tracking-[0.15em]">Total XP</div>
							<div className="relative font-black text-xl">{formatNumber(row.xp)}</div>
						</div>
						<div className="relative overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 p-4">
							<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
							<div className="relative mb-2 font-black text-white/40 text-xs uppercase tracking-[0.15em]">Messages</div>
							<div className="relative font-black text-xl">{formatNumber(row.messageCount)}</div>
						</div>
						<div className="relative overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 p-4">
							<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
							<div className="relative mb-2 font-black text-white/40 text-xs uppercase tracking-[0.15em]">
								XP to Next
							</div>
							<div className="relative font-black text-xl">{formatNumber(row.nextLevelXp - row.xp)}</div>
						</div>
						<div className="relative overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 p-4">
							<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
							<div className="relative mb-2 font-black text-white/40 text-xs uppercase tracking-[0.15em]">Progress</div>
							<div className="relative font-black text-xl">{row.progress.toFixed(1)}%</div>
						</div>
					</div>

					{isManager && (
						<div className="mt-6 flex flex-col gap-3 rounded-2xl border-2 border-danger/30 bg-gradient-to-br from-danger/20 to-danger/10 p-5">
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
