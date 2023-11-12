import { DashboardGuildList } from "@/app/guilds/guild-list.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.png";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { getUser } from "@/lib/auth.ts";
import { API_URL, TOKEN_COOKIE } from "@/utils/constants.ts";
import { type Snowflake, userAvatar } from "@/utils/discord-cdn.ts";
import { greeting } from "@/utils/greeting.ts";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export default async function GuildList() {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const guilds = await getGuilds(token);
	const user = getUser();

	return (
		<div className="flex flex-col items-center gap-2 py-4">
			<header className="mt-3 flex gap-8 px-4 md:px-0">
				<ImageWithFallback
					alt="Your profile picture"
					className="hidden h-28 w-28 rounded-full md:block"
					height={112}
					src={userAvatar(user.id, user.avatar)}
					width={112}
					fallback={fallbackAvatarImg}
					unoptimized={Boolean(user.avatar)}
				/>

				<div>
					<h1 className="mb-4 text-2xl font-semibold text-white">{greeting(user.globalName ?? user.username)}</h1>

					<p className="text-xl tracking-tight text-white/75">
						Which server would like to configure today?{"\n"}
						Below you can find a list of all of your servers you are able to configure!
					</p>

					<p className="text-xl tracking-tight text-white/75">
						Either invite Lurkr to one of them, or select a server with Lurkr already in it!
					</p>
				</div>
			</header>

			<DashboardGuildList guilds={guilds} />
		</div>
	);
}

export const metadata: Metadata = {
	title: "Dashboards • Lurkr",
	description: "Configure your server with Lurkr!",
};

async function getGuilds(token: string) {
	const response = await fetch(`${API_URL}/guilds/@me?withPermissions=true`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		next: {
			revalidate: 60,
		},
	});

	if (response.status === 401) {
		throw new Error("Unauthorized");
	}

	if (!response.ok) {
		throw new Error("Failed to fetch guilds");
	}

	// TODO: Error handling

	return response.json() as Promise<GuildInfo[]>;
}

export interface GuildInfo {
	botIn: boolean;
	icon: string | null;
	id: Snowflake;
	name: string;
}
