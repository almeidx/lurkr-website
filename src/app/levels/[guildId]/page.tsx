import Head from "next/head";
import Image from "next/image";
import { LeaderboardSidebar } from "./leaderboard-sidebar";
import User from "@/leaderboard/User";
import type { Channel, DiscordGuild, ILevel, IMultiplier, RoleReward } from "~/contexts/GuildContext";
import { guildIconCdn } from "~/utils/cdn";
import { type Snowflake, FALLBACK_AVATAR, API_BASE_URL } from "~/utils/constants";

async function getLeaderboardData(guildId: Snowflake) {
	const response = await fetch(`${API_BASE_URL}/levels/${guildId}`, { next: { revalidate: 30 } });

	if (response.status === 404) {
		throw new Error("Guild not found");
	}

	if (response.status === 400) {
		throw new Error("The leveling system is not enabled on this guild");
	}

	if (!response.ok) {
		throw new Error("Failed to retrieve leveling information. Try again later");
	}

	return response.json() as Promise<GetLevelsResult>;
}

export default async function Leaderboard({ params: { guildId } }: { params: { guildId: Snowflake } }) {
	const { channels, guild, levels, multipliers, roleRewards } = await getLeaderboardData(guildId);

	return (
		<div className="flex min-h-screen-no-footer flex-col items-start gap-y-10 bg-discord-dark sm:px-6">
			<Head>
				<title>{`${guild.name} Leaderboard | Pepe Manager`}</title>
			</Head>

			<header className="mt-3 ml-10 flex flex-row items-center justify-center gap-6 sm:mt-10 xl:mt-0">
				<Image
					alt={`${guild.name} guild icon`}
					className="rounded-md"
					height={64}
					src={guild.icon ? guildIconCdn(guildId, guild.icon, 64) : FALLBACK_AVATAR}
					// Only optimize if the image is the fallback avatar
					unoptimized={Boolean(guild.icon)}
					width={64}
				/>

				<p className="text-xl font-bold text-white sm:text-4xl">{guild.name}</p>
			</header>

			<main className="my-4 flex w-full flex-col justify-center gap-y-6 sm:justify-between md:flex-row">
				{levels.length ? (
					<section className="h-fit w-full divide-y-2 divide-solid divide-gray-400 rounded-2xl bg-discord-not-quite-black">
						{levels.map((user, idx) => (
							<User {...user} index={idx} key={user.userId} />
						))}
					</section>
				) : (
					<p className="h-12 w-full rounded-2xl bg-discord-not-quite-black px-3 py-2 text-xl text-white">
						No leveling entries yet!
					</p>
				)}

				<LeaderboardSidebar channels={channels} guild={guild} multipliers={multipliers} roleRewards={roleRewards} />
			</main>
		</div>
	);
}

export interface GetLevelsResult {
	channels: Channel[];
	guild: DiscordGuild;
	levels: ILevel[];
	multipliers: IMultiplier[];
	roleRewards: RoleReward[];
}
