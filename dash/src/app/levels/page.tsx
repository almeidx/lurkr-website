import { isHTTPError } from "ky";
import type { Metadata } from "next";
import { SignInButton } from "@/components/navigation/sign-in.tsx";
import { api } from "@/lib/api.ts";
import { type LeaderboardGuild, LeaderboardGuildList } from "./guild-list.tsx";

export default async function Levels() {
	const guilds = await getLevelingGuilds();

	return (
		<div className="flex flex-col items-center gap-2 py-4">
			<header className="mt-3 flex gap-8">
				<div className="flex flex-col items-center">
					<h1 className="mb-4 text-2xl font-semibold text-white">Leveling Leaderboard</h1>

					<p className="max-w-xl px-2 text-center text-xl tracking-tight text-white/75">
						View the leveling leaderboard of any Lurkr-enabled server including insights and information how best to
						level up!
					</p>
				</div>
			</header>

			<LeaderboardGuildList guilds={guilds ?? []} />

			{guilds ? null : (
				<div className="mt-6 flex flex-col items-center gap-2 text-center text-xl tracking-tight text-white/75">
					If you wish to see the servers you have access to, please login.
					<SignInButton />
				</div>
			)}
		</div>
	);
}

export const metadata: Metadata = {
	description: "View the leveling leaderboard of any Lurkr-enabled server!",
	title: "Leaderboards",
};

async function getLevelingGuilds() {
	try {
		return await api.get("users/@me/guilds/leveling-enabled", { next: { revalidate: 60 } }).json<LeaderboardGuild[]>();
	} catch (error) {
		if (isHTTPError(error) && error.response.status === 401) {
			return null;
		}

		throw error;
	}
}
