"use client";

import { Disclosure, DisclosureContent, DisclosureProvider } from "@ariakit/react";
import { Chip } from "@heroui/react";
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

	return (
		<DisclosureProvider>
			<div className="group">
				<Disclosure className="grid w-full grid-cols-[80px_1fr_100px_100px_100px] items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all hover:border-white/20 hover:bg-white/10">
					<div className="flex justify-center">
						<Chip
							className="font-bold"
							color={getRankChipColor(row.rank)}
							size="sm"
							style={{ backgroundColor: getRankColor(row.rank) }}
							variant="soft"
						>
							{row.rank > 999 ? ":D" : row.rank}
						</Chip>
					</div>

					<div className="flex min-w-0 items-center gap-3">
						<ImageWithFallback
							alt={`${row.user.username} avatar`}
							className="size-8 shrink-0 rounded-full"
							fallback={fallbackAvatarImg}
							height={32}
							src={userAvatar(row.userId, row.user.avatar, { format: "webp", size: 32 })}
							unoptimized={Boolean(row.user.avatar)}
							width={32}
						/>
						<p className="truncate font-medium">{row.user.username}</p>
					</div>

					<div className="xs:block hidden text-center text-sm text-white/70">{formatNumber(row.messageCount)}</div>

					<div className="hidden text-center text-sm text-white/70 sm:block">{formatNumber(row.xp)}</div>

					<div className="flex items-center justify-center">
						<RadialProgressBar color={row.user.accentColour} num={row.level} percentage={row.progress} />
					</div>
				</Disclosure>

				<DisclosureContent className="mt-2 rounded-xl border border-white/10 bg-white/5 p-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-white/60">Experience</span>
								<span className="font-medium">{row.xp.toLocaleString("en")}</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-white/60">Experience until next level</span>
								<span className="font-medium">{(row.nextLevelXp - row.xp).toLocaleString("en")}</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-white/60">Progress</span>
								<span className="font-medium">{row.progress.toFixed(1)}%</span>
							</div>
							<div className="flex items-center justify-between text-sm">
								<span className="text-white/60">Messages</span>
								<span className="font-medium">{row.messageCount.toLocaleString("en")}</span>
							</div>
						</div>

						{isManager && (
							<div className="flex flex-col items-start justify-center gap-3 border-white/10 border-t pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-4">
								<p className="font-semibold text-sm text-white/80">Admin Actions</p>
								<Confirmation
									buttonText="Reset level"
									className="rounded-lg bg-danger px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-danger/80"
									onConfirm={handleResetLevelConfirm}
								>
									Are you sure you want to reset {row.user.username}'s level?
								</Confirmation>
							</div>
						)}
					</div>
				</DisclosureContent>
			</div>
		</DisclosureProvider>
	);
}

function getRankColor(rank: number) {
	return rank === 1 ? "#faa61a" : rank === 2 ? "#cad5db" : rank === 3 ? "#a54e00" : "#171717";
}

function getRankChipColor(rank: number): "default" | "success" | "warning" | "danger" | "accent" | undefined {
	if (rank === 1) return "warning";
	if (rank === 2) return "default";
	if (rank === 3) return "danger";
	return "default";
}

interface LeaderboardTableRowProps {
	readonly guildId: Snowflake;
	readonly row: GetLevelsResponse["levels"][number];
	readonly isManager: boolean;
}
