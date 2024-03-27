import { PageSelector } from "@/app/levels/[guildId]/page-selector.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.png";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { SidebarSection } from "@/components/leaderboard/SidebarSection.tsx";
import type { Guild } from "@/lib/guild.ts";
import { API_URL, MAX_WINDOW_TITLE_LENGTH } from "@/utils/constants.ts";
import { type Snowflake, guildIcon } from "@/utils/discord-cdn.ts";
import { ellipsis } from "@/utils/ellipsis.ts";
import type { Metadata } from "next";
import { type RoleReward, RoleRewardDisplay } from "./01-role-reward.tsx";
import { type Multiplier, MultiplierDisplay } from "./02-multiplier.tsx";
import { type Level, LevelDisplay } from "./03-level.tsx";

if (!process.env.LEVELS_METADATA_KEY) {
	throw new Error("Missing LEVELS_METADATA_KEY environment variable");
}

export default async function Leaderboard({ params: { guildId }, searchParams }: LeaderboardProps) {
	const page = Number.parseInt(searchParams.page, 10);

	if (Number.isNaN(page)) {
		return <p>Invalid page number</p>;
	}

	const { guild, levels, multipliers, roleRewards } = await getData(guildId, page);

	return (
		<div className="flex flex-col md:flex-row py-4">
			<div className="flex max-w-lg h-full flex-col gap-12 border-r px-16">
				<div className="flex items-center">
					<ImageWithFallback
						className="mr-6 h-20 w-20 rounded-full"
						width={80}
						height={80}
						src={guildIcon(guild.id, guild.icon)}
						alt={`${guild.name}'s icon`}
						fallback={fallbackAvatarImg}
						unoptimized={Boolean(guild.icon)}
					/>

					<h1 className="border-l-2 border-white/75 py-1 pl-6">{guild.name}</h1>
				</div>

				<div className="flex flex-col items-center gap-4">
					<h2 className="text-2xl font-semibold">Role Rewards</h2>

					<SidebarSection>
						{roleRewards.length ? (
							<div className="flex min-w-[250px] max-w-xs flex-col gap-4">
								{roleRewards.map((roleReward) => (
									<RoleRewardDisplay key={roleReward.id} {...roleReward} />
								))}
							</div>
						) : (
							<p className="text-center text-lg">No role rewards set</p>
						)}
					</SidebarSection>
				</div>

				<div className="flex flex-col items-center gap-4">
					<h2 className="text-2xl font-semibold">Multipliers</h2>

					<SidebarSection>
						{multipliers.length ? (
							<div className="flex min-w-[250px] max-w-xs flex-col gap-4">
								{multipliers.map((multipliers) => (
									<MultiplierDisplay key={multipliers.id} {...multipliers} />
								))}
							</div>
						) : (
							<p className="text-center text-lg">No multipliers set</p>
						)}
					</SidebarSection>
				</div>
			</div>

			<div className="mb-4 mt-6 flex flex-1 flex-col gap-4 px-2 text-center md:mt-0 md:px-12 md:text-left">
				<h2 className="text-2xl font-semibold">Leveling Leaderboard</h2>

				<table className="w-full border-separate rounded-lg border bg-dark-gray">
					<thead>
						<tr>
							<th align="center" className="min-w-[80px] py-4 font-normal text-white/75">
								Rank
							</th>

							<th align="left" className="min-w-[180px] pl-4 font-normal text-white/75 md:min-w-[240px]">
								User
							</th>

							<th align="left" className="hidden min-w-[110px] font-normal text-white/75 md:table-cell">
								Messages
							</th>

							<th align="left" className="hidden min-w-[110px] font-normal text-white/75 md:table-cell">
								Experience
							</th>

							<th align="left" className="w-full font-normal text-white/75">
								Level
							</th>
						</tr>
					</thead>

					<tbody>
						{levels.map((level) => (
							<LevelDisplay key={level.userId} {...level} />
						))}
					</tbody>
				</table>

				<PageSelector guildId={guildId} page={page} amount={levels.length} />
			</div>
		</div>
	);
}

export async function generateMetadata({ params: { guildId } }: LeaderboardProps): Promise<Metadata> {
	const response = await fetch(`${API_URL}/levels/${guildId}/metadata`, {
		headers: {
			Authorization: process.env.LEVELS_METADATA_KEY!,
		},
		next: {
			revalidate: 6 * 60 * 60, // 6 hours
		},
	});

	if (!response.ok) {
		return {
			title: "Leaderboard • Lurkr",
			description: "View the leveling leaderboard of a Discord server, including rewards and multipliers!",
		};
	}

	const guild = (await response.json()) as LevelsGuildMetadataResponse;

	const titleSuffix = " • Leaderboard • Lurkr";

	return {
		title: `${ellipsis(guild.name, MAX_WINDOW_TITLE_LENGTH - titleSuffix.length)}${titleSuffix}`,
		description: `View the leveling leaderboard of ${guild.name}, including rewards and multipliers!`,
	};
}

async function getData(guildId: Snowflake, page: number) {
	const response = await fetch(`${API_URL}/levels/${guildId}?page=${page}`, {
		next: { revalidate: 60 },
	});

	if (response.status === 401) {
		throw new Error("Unauthorized");
	}

	if (!response.ok) {
		throw new Error("Failed to fetch leaderboard data");
	}

	return response.json() as Promise<GetLevelsResponse>;
}

interface LevelsGuildMetadataResponse {
	readonly name: string;
}

interface GetLevelsResponse {
	guild: Omit<Guild, "channels" | "emojis" | "roles">;
	levels: Level[];
	multipliers: Multiplier[];
	roleRewards: RoleReward[];
}

interface LeaderboardProps {
	params: { guildId: string };
	searchParams: { page: string };
}
