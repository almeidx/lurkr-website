import { DashboardGuildList } from "@/app/guilds/guild-list.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.png";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import type { User } from "@/lib/auth.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { type Snowflake, userAvatar } from "@/utils/discord-cdn.ts";
import { greeting } from "@/utils/greeting.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export default async function GuildList() {
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guilds, user } = await getGuilds(token);

	return (
		<div className="flex flex-col items-center gap-2 py-4">
			<header className="mt-3 flex gap-8 px-4 md:px-0">
				<ImageWithFallback
					alt="Your profile picture"
					className="hidden size-28 rounded-full md:block"
					height={112}
					src={userAvatar(user.id, user.avatar)}
					width={112}
					fallback={fallbackAvatarImg}
					unoptimized={Boolean(user.avatar)}
				/>

				<div>
					<h1 className="mb-4 font-semibold text-2xl text-white">{greeting(user.globalName ?? user.username)}</h1>

					<p className="text-white/75 text-xl tracking-tight">
						Which server would like to configure today? Below you can find a list of all of your servers you are able to
						configure!
					</p>

					<p className="text-white/75 text-xl tracking-tight">
						Either invite Lurkr to one of them, or select a server with Lurkr already in it!
					</p>
				</div>
			</header>

			<DashboardGuildList guilds={guilds} />
		</div>
	);
}

export const metadata: Metadata = {
	title: "Dashboards",
	description: "Configure your server with Lurkr!",
};

async function getGuilds(token: string) {
	const [getGuildsResponse, getCurrentUserResponse] = await Promise.all([
		makeApiRequest("/users/@me/guilds", token, {
			next: {
				revalidate: 60, // 1 minute
			},
		}),
		makeApiRequest("/users/@me", token, {
			next: {
				revalidate: 60 * 60, // 1 hour
				tags: ["user"],
			},
		}),
	]);

	if (getGuildsResponse.status === 401 || !getCurrentUserResponse.ok) {
		throw new Error("Unauthorized");
	}

	const user = (await getCurrentUserResponse.json()) as User;

	if (!getGuildsResponse.ok) {
		return {
			guilds: [],
			user,
		};
	}

	return {
		guilds: (await getGuildsResponse.json()) as GuildInfo[],
		user,
	};
}

export interface GuildInfo {
	botIn: boolean;
	icon: string | null;
	id: Snowflake;
	name: string;
}
