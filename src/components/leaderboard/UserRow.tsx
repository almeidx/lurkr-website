"use client";

import Image from "next/image";
import type { ChangeEvent } from "react";
import type { ILevel } from "~/contexts/GuildContext";
import { userAvatarCdn, userDefaultAvatarCdn } from "~/utils/cdn";
import { type Snowflake, FALLBACK_AVATAR, getRequiredXp } from "~/utils/constants";

export default function UserRow({ accentColour, avatar, index, level, messageCount, tag, userId, xp }: UserProps) {
	const currentLevelRequiredXp = getRequiredXp(level);
	const nextLevelRequiredXp = getRequiredXp(level + 1);
	const levelXp = nextLevelRequiredXp - currentLevelRequiredXp;
	const userXp = xp - currentLevelRequiredXp;
	const percentage = userXp / levelXp;

	const formatter = new Intl.NumberFormat(undefined, { notation: "compact" });
	const circumference = 30 * 2 * Math.PI;

	return (
		<tr className="h-24 text-xl font-medium text-white">
			<td align="center" className="mx-auto flex h-full items-center justify-center px-3 py-2">
				<span
					className={`flex w-9 items-center justify-center rounded-full px-3 py-1 text-white ${
						index >= 3 ? "bg-[#15181c]" : index === 2 ? "bg-[#a54e00]" : index === 1 ? "bg-[#cad5db]" : "bg-[#faa61a]"
					}`}
				>
					{index + 1}
				</span>
			</td>
			<td className="px-3 py-2">
				<div className="flex items-center gap-4 sm:gap-8">
					<Image
						alt={`${tag} avatar`}
						className="rounded-full"
						height={64}
						onError={(event: ChangeEvent<HTMLImageElement>) => {
							event.target.onerror = null;
							event.target.src = FALLBACK_AVATAR.src;
						}}
						src={avatar || tag ? makeUserAvatarUrl(userId, avatar, tag) : FALLBACK_AVATAR}
						unoptimized
						width={64}
					/>

					<span className="overflow-hidden text-ellipsis">{tag ?? userId}</span>
				</div>
			</td>
			<td align="center" className="hidden px-3 py-2 lg:table-cell">
				{formatter.format(messageCount)}
			</td>
			<td align="center" className="hidden whitespace-nowrap px-3 py-2 lg:table-cell">
				{formatter.format(xp)} / {formatter.format(nextLevelRequiredXp)}
			</td>
			<td align="center" className="mx-auto px-3 py-2">
				<div className="inline-flex items-center justify-center overflow-hidden rounded-full">
					<svg className="h-20 w-20">
						<circle
							className="text-white"
							cx="40"
							cy="40"
							fill="transparent"
							r="30"
							stroke="currentColor"
							strokeWidth="5"
						/>
						<circle
							cx="40"
							cy="40"
							fill="transparent"
							r="30"
							stroke={accentColour}
							strokeDasharray={circumference}
							strokeDashoffset={circumference - percentage * circumference}
							strokeLinecap="round"
							strokeWidth="5"
							transform="rotate(-90 40 40)"
						/>
					</svg>
					<span className="absolute text-xl">{level}</span>
				</div>
			</td>
		</tr>
	);
}

function makeUserAvatarUrl(id: Snowflake, hash: string | null, tag: string | null) {
	return hash
		? userAvatarCdn(id, hash, 64, false)
		: tag
		? userDefaultAvatarCdn(tag.split(/#(\d{4})$/)[1]!, 64)
		: FALLBACK_AVATAR;
}

type UserProps = ILevel & { index: number };
