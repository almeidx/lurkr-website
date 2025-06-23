import type { Metadata } from "next";
import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { LeaderboardGuildInput, LeaderboardGuildList } from "./guild-list.tsx";

export default async function Levels() {
	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	const data = token ? await getGuilds(token) : null;

	return (
		<div className="flex flex-col items-center gap-2 py-4">
			<header className="mt-3 flex gap-8">
				<div className="flex flex-col items-center">
					<h1 className="mb-4 font-semibold text-2xl text-white">Leveling Leaderboard</h1>

					<p className="max-w-xl px-2 text-center text-white/75 text-xl tracking-tight">
						View the leveling leaderboard of any Lurkr-enabled server including insights and information how best to
						level up!
					</p>
				</div>
			</header>

			{data ? <LeaderboardGuildList guilds={data} /> : <LeaderboardGuildInput />}
		</div>
	);
}

export const metadata: Metadata = {
	description: "View the leveling leaderboard of any Lurkr-enabled server!",
	title: "Leaderboards",
};

async function getGuilds(token: string) {
	const response = await makeApiRequest("/users/@me/guilds/leveling-enabled", token, {
		next: {
			revalidate: 60,
		},
	});

	if (!response.ok) {
		return [];
	}

	return response.json() as Promise<GuildInfo[]>;
}

export interface GuildInfo {
	icon: string | null;
	id: Snowflake;
	name: string;
	vanity: string | null;
}
