import fallbackAvatarImg from "@/assets/fallback-avatar.png";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { type Snowflake, userAvatar } from "@/utils/discord-cdn.ts";
import { formatNumber } from "@/utils/format-number.ts";

export function LevelDisplay({ userId, user, messageCount, nextLevelXp, progress, xp, level, rank }: Level) {
	const rankColor = rank === 1 ? "#faa61a" : rank === 2 ? "#cad5db" : rank === 3 ? "#a54e00" : "#171717";

	return (
		<tr key={userId}>
			<td align="center">
				<span
					className="flex h-[30px] w-[30px] items-center justify-center rounded-full font-bold"
					style={{ backgroundColor: rankColor, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.50)" }}
				>
					{rank}
				</span>
			</td>

			<td className="flex items-center pb-4 pt-2">
				<ImageWithFallback
					className="h-16 w-16 rounded-full"
					width={64}
					height={64}
					src={userAvatar(userId, user.avatar, { format: "webp", size: 64 })}
					alt={`${user.username}'s avatar`}
					fallback={fallbackAvatarImg}
					priority={rank % 100 <= 10}
					unoptimized={Boolean(user.avatar)}
				/>

				<span className="ml-3 truncate text-[#fff] md:ml-9">{user.username}</span>
			</td>

			<td className="hidden text-white/75 md:table-cell">{formatNumber(messageCount)}</td>

			<td className="hidden whitespace-nowrap pr-2 text-white/75 md:table-cell">
				{formatNumber(xp)} / {formatNumber(nextLevelXp)}
			</td>

			<td className="flex-1 text-white/75">
				<div className="flex items-center justify-between gap-6 pr-6">
					<span className="w-20 text-4xl font-extrabold">{level.toLocaleString()}</span>

					<div className="hidden h-7 w-full rounded-3xl bg-light-gray shadow-dim-inner md:block">
						<div
							className="h-7 rounded-3xl"
							style={{
								background: `linear-gradient(to right, #00000000 ${progress}%, #474747 ${progress}%), ${
									user.accentColour ?? "linear-gradient(94deg, #FFE87C 0%, #FF7077 100%)"
								}`,
							}}
						/>
					</div>
				</div>
			</td>
		</tr>
	);
}

export interface Level {
	readonly level: number;
	readonly messageCount: number;
	readonly nextLevelXp: number;
	readonly progress: number;
	readonly rank: number;
	readonly user: {
		accentColour: `#${string}` | null;
		avatar: string | null;
		discriminator: string;
		username: string;
	};
	readonly userId: Snowflake;
	readonly xp: number;
}
