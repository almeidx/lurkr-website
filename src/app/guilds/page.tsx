import type { Metadata } from "next";
import { headers } from "next/headers";
import Guild from "~/components/Guild";
import type { UserGuild } from "~/contexts/UserContext";
import { API_BASE_URL } from "~/utils/constants";

async function getDashboardGuilds() {
	const headersList = headers();
	const cookie = headersList.get("cookie");

	const response = await fetch(`${API_BASE_URL}/guilds/@me?withPermissions=true`, {
		cache: "no-store",
		credentials: "include",
		headers: cookie ? { cookie } : {},
	});

	if (response.status === 401) {
		throw new Error("You need to sign in to view this page");
	}

	if (!response.ok) {
		throw new Error("Failed to retrieve guilds. Try again later");
	}

	const data = (await response.json()) as GetGuildsMeResult;

	if (!data.length) {
		throw new Error("You are not the manager of any guilds");
	}

	return data.sort((a, b) => a.name.localeCompare(b.name));
}

export default async function Guilds() {
	const guilds = await getDashboardGuilds();

	return (
		<div className="flex min-h-screen-no-footer flex-col items-center justify-center gap-y-8 bg-discord-dark py-6 text-center sm:pt-0">
			<h1 className="font-display text-2xl font-bold text-white sm:text-4xl">
				Pick the server you would like to configure
			</h1>

			<main className="flex max-w-7xl flex-row flex-wrap items-start justify-center gap-6">
				{guilds.map(({ icon, id, name }) => (
					<Guild baseRedirectPath="/guilds/" icon={icon} id={id} key={id} name={name} />
				))}
			</main>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Dashboard | Pepe Manager",
};

type GetGuildsMeResult = UserGuild[];
