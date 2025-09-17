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

	return (
		<DisclosureProvider>
			<div>
				<Disclosure className="flex w-full items-center gap-1 rounded-lg border border-white/25 bg-dark-gray px-2 py-1.5 hover:bg-dark-gray/50 aria-expanded:mb-0 aria-expanded:rounded-t-lg aria-expanded:rounded-b-none">
					<div className="flex min-w-14 max-w-[15%] justify-center rounded-s-lg">
						<div
							className="flex size-8 items-center justify-center rounded-full font-bold text-shadow-regular"
							style={{ backgroundColor: getRankColor(row.rank) }}
							title={row.rank.toString()}
						>
							{row.rank > 999 ? ":D" : row.rank}
						</div>
					</div>

					<div className="flex w-full items-center truncate">
						<ImageWithFallback
							alt={`${row.user.username} avatar`}
							className="mr-4 size-8 rounded-full"
							fallback={fallbackAvatarImg}
							height={32}
							src={userAvatar(row.userId, row.user.avatar, { format: "webp", size: 32 })}
							unoptimized={Boolean(row.user.avatar)}
							width={32}
						/>

						<p className="max-w-40 sm:max-w-96">{row.user.username}</p>
					</div>

					<div className="xs:block hidden min-w-14 max-w-[15%] text-center">{formatNumber(row.messageCount)}</div>

					<div className="hidden min-w-14 max-w-[15%] text-center sm:block">{formatNumber(row.xp)}</div>

					<div className="flex min-w-14 max-w-[15%] items-center justify-center">
						<RadialProgressBar color={row.user.accentColour} num={row.level} percentage={row.progress} />
					</div>
				</Disclosure>

				<DisclosureContent className="mb-4 flex w-full flex-col justify-between gap-2 rounded-b-lg border-white/25 border-x border-b bg-dark-gray/50 px-2 py-1.5 md:flex-row md:gap-0">
					<div>
						<p>
							Experience: <span className="text-white/75">{row.xp.toLocaleString("en")}</span>
						</p>
						<p>
							Experience until next level:{" "}
							<span className="text-white/75">{(row.nextLevelXp - row.xp).toLocaleString("en")}</span>
						</p>
						<p>
							Progress: <span className="text-white/75">{row.progress.toFixed(1)}%</span>
						</p>
						<p>
							Messages: <span className="text-white/75">{row.messageCount.toLocaleString("en")}</span>
						</p>
					</div>

					{isManager && (
						<div>
							<p className="mb-2 w-fit border-b text-base">Admin actions:</p>

							<Confirmation
								buttonText="Reset level"
								className="size-fit rounded-lg bg-red px-2 py-1.5 text-sm hover:bg-red/75"
								onConfirm={handleResetLevelConfirm}
							>
								Are you sure you want to reset {row.user.username}'s level?
							</Confirmation>
						</div>
					)}
				</DisclosureContent>
			</div>
		</DisclosureProvider>
	);
}

function getRankColor(rank: number) {
	return rank === 1 ? "#faa61a" : rank === 2 ? "#cad5db" : rank === 3 ? "#a54e00" : "#171717";
}

interface LeaderboardTableRowProps {
	readonly guildId: Snowflake;
	readonly row: GetLevelsResponse["levels"][number];
	readonly isManager: boolean;
}
