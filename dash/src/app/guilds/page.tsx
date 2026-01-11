import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DashboardGuildList } from "@/app/guilds/guild-list.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ErrorState } from "@/components/error-state.tsx";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { SignInButton } from "@/components/SignIn.tsx";
import type { User } from "@/lib/auth.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { type Snowflake, userAvatar } from "@/utils/discord-cdn.ts";
import { greeting } from "@/utils/greeting.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

export default async function GuildList() {
	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	const data = await getGuilds(token);

	if (!data) {
		return (
			<ErrorState
				description="Connect with Discord to see all the servers you can configure Lurkr on."
				statusCode={401}
				title="Sign in to view your servers"
			>
				<SignInButton />
			</ErrorState>
		);
	}

	const { guilds, user } = data;

	return (
		<div className="container mx-auto flex flex-col gap-8 px-4 py-8">
			<header className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:gap-8 md:text-left">
				<ImageWithFallback
					alt="Your profile picture"
					className="hidden shrink-0 rounded-full ring-2 ring-white/20 md:block md:size-28"
					fallback={fallbackAvatarImg}
					height={112}
					src={userAvatar(user.id, user.avatar)}
					unoptimized={Boolean(user.avatar)}
					width={112}
				/>

				<div className="flex min-w-0 flex-col gap-3">
					<h1 className="bg-linear-to-br from-white to-white/50 bg-clip-text pb-1 font-bold text-4xl text-transparent">
						{greeting(user.globalName ?? user.username)}
					</h1>
					<p className="max-w-xl text-lg text-white/70">
						Select a server to configure, or invite Lurkr to a new one. Servers with Lurkr installed are highlighted.
					</p>
				</div>
			</header>

			<DashboardGuildList guilds={guilds} />
		</div>
	);
}

export const metadata: Metadata = {
	description: "Configure your server with Lurkr!",
	title: "Dashboards",
};

async function getGuilds(token: string | undefined) {
	if (!token) {
		return null;
	}

	const [getGuildsResponse, getCurrentUserResponse] = await Promise.all([
		makeApiRequest("/users/@me/guilds", token, {
			next: {
				revalidate: 60,
			},
		}),
		makeApiRequest("/users/@me", token, {
			next: {
				revalidate: 60 * 60,
				tags: ["user"],
			},
		}),
	]);

	if (getGuildsResponse.status === 401 || !getCurrentUserResponse.ok) {
		return null;
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
