import { Medal } from "@gravity-ui/icons";
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
		<div className="container mx-auto flex flex-col gap-6 px-4 py-8">
			<header className="flex items-center gap-4">
				<div className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-yellow-500/20 ring-1 ring-white/10 md:flex">
					<Medal className="size-6 text-primary" />
				</div>
				<div className="flex flex-col gap-0.5">
					<h1 className="bg-linear-to-br from-white to-white/50 bg-clip-text font-bold text-4xl text-transparent">
						Leveling Leaderboards
					</h1>
					<p className="text-white/60">View any server's leaderboard by searching below or entering its ID.</p>
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
