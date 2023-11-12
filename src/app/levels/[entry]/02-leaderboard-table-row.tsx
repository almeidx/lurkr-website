"use client";

import { userLevelResetAction } from "@/app/levels/[entry]/actions";
import type { GetLevelsResponse } from "@/app/levels/[entry]/page";
import fallbackAvatarImg from "@/assets/fallback-avatar.png";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { RadialProgressBar } from "@/components/RadialProgressBar.tsx";
import { type Snowflake, userAvatar } from "@/utils/discord-cdn.ts";
import { formatNumber } from "@/utils/format-number.ts";
import { Disclosure, DisclosureContent, useDisclosureStore } from "@ariakit/react/disclosure";
import clsx from "clsx";
import dynamic from "next/dynamic";

const Confirmation = dynamic(() => import("@/components/Confirmation.tsx").then((mod) => mod.Confirmation));

export function LeaderboardTableRow({ guildId, row, isManager }: LeaderboardTableRowProps) {
	const disclosure = useDisclosureStore();
	const open = disclosure.useState("open");

	async function handleResetLevelConfirm() {
		await userLevelResetAction(guildId, row.userId);
	}

	return (
		<>
			<Disclosure
				className={clsx(
					"flex items-center gap-1 border border-white/25 bg-dark-gray hover:bg-dark-gray/50 px-2 py-1.5 w-full",
					open ? "rounded-t-lg mb-0" : "rounded-lg mb-4",
				)}
				key={row.userId}
				store={disclosure}
			>
				<div className="min-w-14 max-w-[15%] rounded-s-lg flex justify-center">
					<div
						className="rounded-full size-8 flex items-center justify-center text-shadow-regular font-bold"
						style={{ backgroundColor: getRankColor(row.rank) }}
					>
						{row.rank > 999 ? ":D" : row.rank}
					</div>
				</div>

				<div className="w-full flex items-center truncate">
					<ImageWithFallback
						alt={`${row.user.username} avatar`}
						className="rounded-full size-8 mr-4"
						src={userAvatar(row.userId, row.user.avatar, { size: 32, format: "webp" })}
						fallback={fallbackAvatarImg}
						width={32}
						height={32}
						unoptimized={Boolean(row.user.avatar)}
					/>

					<p className="max-w-40 sm:max-w-96">{row.user.username}</p>
				</div>

				<div className="hidden xs:block min-w-14 max-w-[15%] text-center">{formatNumber(row.messageCount)}</div>

				<div className="hidden sm:block min-w-14 max-w-[15%] text-center">{formatNumber(row.xp)}</div>

				<div className="min-w-14 max-w-[15%] flex items-center justify-center">
					<RadialProgressBar color={row.user.accentColour} percentage={row.progress} num={row.level} />
				</div>
			</Disclosure>

			<DisclosureContent
				className="mb-4 flex gap-2 md:gap-0 flex-col md:flex-row justify-between border-b border-x border-white/25 bg-dark-gray/50 rounded-b-lg px-2 py-1.5 w-full"
				store={disclosure}
			>
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
						<p className="text-base border-b mb-2 w-fit">Admin actions:</p>

						<Confirmation
							className="size-fit bg-red rounded-lg px-2 py-1.5 hover:bg-red/75 text-sm"
							onConfirm={handleResetLevelConfirm}
							buttonText="Reset level"
						>
							Are you sure you want to reset {row.user.username}'s level?
						</Confirmation>
					</div>
				)}
			</DisclosureContent>
		</>
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
