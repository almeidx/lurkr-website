import type { Metadata } from "next";
import Image from "next/image";
import { LeaderboardSidebar } from "./sidebar";
import UserRow from "~/components/leaderboard/UserRow";
import type { DiscordGuild, ILevel, IMultiplier, RoleReward } from "~/contexts/GuildContext";
import { guildIconCdn } from "~/utils/cdn";
import { API_BASE_URL, FALLBACK_AVATAR, type Snowflake } from "~/utils/constants";

export default async function LeaderboardPage({ params }: { params: { guildId: Snowflake } }) {
	const { guild, levels, multipliers, roleRewards } = await getLeaderboard(params.guildId);

	return (
		<div className="min-h-screen-no-footer bg-discord-dark flex flex-col items-start gap-y-10 sm:px-6">
			<main className="mx-auto my-4 flex w-full flex-col justify-center gap-y-6 xl:max-w-7xl">
				<div className="flex items-center gap-3">
					<Image
						alt={`${guild.name} guild icon`}
						className="rounded-md"
						height={64}
						priority
						src={guild.icon ? guildIconCdn(params.guildId, guild.icon, 64) : FALLBACK_AVATAR}
						// Only optimize if the image is the fallback avatar
						unoptimized={Boolean(guild.icon)}
						width={64}
					/>

					<p className="text-xl font-bold text-white sm:text-4xl">{guild.name}</p>
				</div>

				<div className="flex w-full flex-col justify-center gap-y-6 sm:justify-between md:flex-row">
					{levels.length ? (
						<table className="bg-discord-not-quite-black h-fit w-full divide-y-2 divide-solid divide-gray-400 rounded-2xl text-left font-medium text-white">
							<thead>
								<tr className="h-12 text-xl">
									<th align="center" className="px-3 py-2">
										Rank
									</th>
									<th className="w-full px-3 py-2">User</th>
									<th align="center" className="hidden px-3 py-2 lg:table-cell">
										Messages
									</th>
									<th align="center" className="hidden px-3 py-2 lg:table-cell">
										XP
									</th>
									<th align="center" className="px-3 py-2">
										Level
									</th>
								</tr>
							</thead>

							<tbody>
								{levels.map((user, idx) => (
									<UserRow index={idx} key={idx} {...user} />
								))}
							</tbody>
						</table>
					) : (
						<p className="bg-discord-not-quite-black h-12 w-full rounded-2xl px-3 py-2 text-xl text-white">
							No leveling entries yet!
						</p>
					)}

					<LeaderboardSidebar multipliers={multipliers} roleRewards={roleRewards} />
				</div>
			</main>
		</div>
	);
}

export async function generateMetadata({ params }: { params: { guildId: Snowflake } }): Promise<Metadata> {
	const leaderboard = await getLeaderboard(params.guildId);
	const isError = "error" in leaderboard;

	return {
		title: isError ? "Leaderboard | Lurkr" : `${leaderboard.guild.name} Leaderboard | Lurkr`,
		description: isError
			? "View the leaderboard of a server on Lurkr"
			: `View the leaderboard of ${leaderboard.guild.name} on Lurkr`,
	};
}

async function getLeaderboard(guildId: Snowflake) {
	const response = await fetch(`${API_BASE_URL}/levels/${guildId}?page=1`, { next: { revalidate: 30 } });

	if (!response.ok) {
		throw new Error("Failed to retrieve leveling information. Try again later", {
			cause:
				response.status === 404
					? "Guild not found"
					: response.status === 400
					? "The leveling system is not enabled on this guild"
					: null,
		});
	}

	// if (!response) {
	// 	return { error: "Failed to retrieve leveling information. Try again later" };
	// }

	// if (response.status === 404) {
	// 	return { error: "Guild not found" };
	// }

	// if (response.status === 400) {
	// 	return { error: "The leveling system is not enabled on this guild" };
	// }

	return response.json() as Promise<GetLevelsResult>;
}

interface GetLevelsResult {
	guild: Omit<DiscordGuild, "roles">;
	levels: ILevel[];
	multipliers: IMultiplier[];
	roleRewards: RoleReward[];
}
