import { headers } from "next/headers";
import { GuildInput } from "./guild-input";
import Guild from "~/components/Guild";
import type { UserGuild } from "~/contexts/UserContext";
import { API_BASE_URL } from "~/utils/constants";

async function getGuilds() {
	const headersList = headers();
	const cookie = headersList.get("cookie");

	const response = await fetch(API_BASE_URL + "/guilds/@me", {
		credentials: "include",
		headers: cookie ? { cookie } : {},
	});

	if (!response.ok) {
		return null;
	}

	const data = (await response.json()) as GetGuildsMeResult;

	return data.sort((a, b) => a.name.localeCompare(b.name));
}

export default async function Levels() {
	const guilds = await getGuilds();

	return (
		<div className="flex min-h-screen-no-footer flex-col items-center justify-center gap-y-8 bg-discord-dark text-center">
			{guilds ? (
				<>
					<h1 className="font-display text-xl font-bold text-white sm:text-3xl">Pick a server to view the levels of</h1>
					<main className="flex max-w-7xl flex-row flex-wrap items-start justify-center gap-6">
						{guilds.map(({ icon, id, name }) => (
							<Guild baseRedirectPath="/levels/" icon={icon} id={id} key={id} name={name} />
						))}
					</main>
				</>
			) : null}

			<div className="flex w-full flex-col items-center justify-center px-4 text-center">
				<h1 className="font-display text-xl font-bold text-white sm:text-3xl">
					{guilds ? "Or enter a server ID/vanity" : "Enter the ID/vanity of the server you want to view"}
				</h1>

				<div className="w-full sm:w-8/12 md:w-6/12 lg:w-4/12">
					<GuildInput />
				</div>
			</div>
		</div>
	);
}

type GetGuildsMeResult = UserGuild[];
