import type { Metadata } from "next";
import { headers } from "next/headers";
import LeaderboardGuildIdInput from "./guildIdInput";
import Guild from "~/components/Guild";
import type { UserGuild } from "~/contexts/UserContext";
import { API_BASE_URL } from "~/utils/constants";

export const runtime = "edge";

export default async function LevelsPage() {
	const guilds = await getGuilds();

	return (
		<div className="min-h-screen-no-footer bg-discord-dark flex flex-col items-center justify-center gap-y-8 text-center">
			{guilds ? (
				<>
					<h1 className="text-xl font-bold text-white sm:text-3xl">Pick a server to view the leaderboard of</h1>
					<main className="flex max-w-7xl flex-row flex-wrap items-start justify-center gap-6">
						{guilds.map(({ icon, id, name }) => (
							<Guild baseRedirectPath="/levels" icon={icon} id={id} key={id} name={name} />
						))}
					</main>
				</>
			) : null}

			<div className="flex w-full flex-col items-center justify-center px-4 text-center">
				<h1 className="text-xl font-bold text-white sm:text-3xl">
					{guilds ? "Or enter a server ID or vanity" : "Enter the ID or vanity of the server you want to view"}
				</h1>

				<form className="w-full sm:w-8/12 md:w-6/12 lg:w-4/12">
					<LeaderboardGuildIdInput />
				</form>
			</div>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Levels | Lurkr",
};

async function getGuilds() {
	const reqHeaders = headers();

	const response = await fetch(API_BASE_URL + "/guilds/@me", {
		credentials: "include",
		headers: reqHeaders.has("cookie") ? { cookie: reqHeaders.get("cookie")! } : {},
	});

	if (!response?.ok) {
		return null;
	}

	const data = (await response.json()) as GetGuildsMeResult;

	return data.sort((a, b) => a.name.localeCompare(b.name));
}

type GetGuildsMeResult = UserGuild[];
