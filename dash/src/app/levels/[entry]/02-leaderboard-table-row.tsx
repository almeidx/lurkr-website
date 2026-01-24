"use client";

import { Disclosure, DisclosureContent, DisclosureProvider } from "@ariakit/react";
import { Card } from "@heroui/react";
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

	const rankBadge = (
		<div
			className="flex size-12 shrink-0 items-center justify-center rounded-xl font-bold text-sm shadow-lg"
			style={{
				background:
					row.rank === 1
						? "linear-gradient(135deg, #faa61a 0%, #ff8c00 100%)"
						: row.rank === 2
							? "linear-gradient(135deg, #cad5db 0%, #a8b8c8 100%)"
							: row.rank === 3
								? "linear-gradient(135deg, #a54e00 0%, #8b3d00 100%)"
								: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
			}}
		>
			{row.rank > 999 ? ":D" : `#${row.rank}`}
		</div>
	);

	return (
		<DisclosureProvider>
			<Card className="group border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] transition-all hover:border-white/20 hover:shadow-lg hover:shadow-primary/5">
				<Disclosure className="w-full">
					<Card.Body className="p-5">
						<div className="flex items-center gap-4">
							{rankBadge}

							<div className="flex min-w-0 flex-1 items-center gap-4">
								<ImageWithFallback
									alt={`${row.user.username} avatar`}
									className="size-12 shrink-0 rounded-full border-2 border-white/20 ring-2 ring-white/10"
									fallback={fallbackAvatarImg}
									height={48}
									src={userAvatar(row.userId, row.user.avatar, { format: "webp", size: 64 })}
									unoptimized={Boolean(row.user.avatar)}
									width={48}
								/>

								<div className="min-w-0 flex-1">
									<p className="truncate font-semibold text-lg">{row.user.username}</p>
									<div className="mt-1 flex items-center gap-4 text-sm text-white/60">
										<span className="xs:inline hidden">
											{formatNumber(row.messageCount)} <span className="text-white/40">msgs</span>
										</span>
										<span className="hidden sm:inline">
											{formatNumber(row.xp)} <span className="text-white/40">XP</span>
										</span>
									</div>
								</div>
							</div>

							<div className="flex items-center gap-4">
								<div className="hidden flex-col items-end sm:flex">
									<div className="font-semibold text-sm">Level {row.level}</div>
									<div className="text-white/50 text-xs">{row.progress.toFixed(1)}% to next</div>
								</div>
								<div className="shrink-0">
									<RadialProgressBar color={row.user.accentColour} num={row.level} percentage={row.progress} />
								</div>
							</div>
						</div>
					</Card.Body>
				</Disclosure>

				<DisclosureContent>
					<Card.Body className="border-white/10 border-t pt-4">
						<div className="grid gap-6 md:grid-cols-2">
							<div className="grid grid-cols-2 gap-4">
								<div className="rounded-lg border border-white/10 bg-white/5 p-3">
									<div className="text-white/50 text-xs">Total XP</div>
									<div className="mt-1 font-semibold text-lg">{formatNumber(row.xp)}</div>
								</div>
								<div className="rounded-lg border border-white/10 bg-white/5 p-3">
									<div className="text-white/50 text-xs">Messages</div>
									<div className="mt-1 font-semibold text-lg">{formatNumber(row.messageCount)}</div>
								</div>
								<div className="rounded-lg border border-white/10 bg-white/5 p-3">
									<div className="text-white/50 text-xs">XP to Next</div>
									<div className="mt-1 font-semibold text-lg">{formatNumber(row.nextLevelXp - row.xp)}</div>
								</div>
								<div className="rounded-lg border border-white/10 bg-white/5 p-3">
									<div className="text-white/50 text-xs">Progress</div>
									<div className="mt-1 font-semibold text-lg">{row.progress.toFixed(1)}%</div>
								</div>
							</div>

							{isManager && (
								<div className="flex flex-col gap-3 border-white/10 md:border-l md:pl-6">
									<p className="font-semibold text-sm text-white/80">Admin Actions</p>
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
					</Card.Body>
				</DisclosureContent>
			</Card>
		</DisclosureProvider>
	);
}

interface LeaderboardTableRowProps {
	readonly guildId: Snowflake;
	readonly row: GetLevelsResponse["levels"][number];
	readonly isManager: boolean;
}
