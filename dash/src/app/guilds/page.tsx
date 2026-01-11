import type { Metadata } from "next";
import { cookies } from "next/headers";
import { DashboardGuildList } from "@/app/guilds/guild-list.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
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
			<div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
				<div className="relative">
					<div className="absolute -inset-4 rounded-3xl bg-linear-to-br from-primary/20 via-transparent to-yellow-500/20 opacity-50 blur-2xl" />
					<div className="relative rounded-2xl border border-white/10 bg-surface/80 px-8 py-12 text-center backdrop-blur-sm">
						<div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-yellow-500/20">
							<svg
								aria-hidden="true"
								className="size-10 text-primary"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								viewBox="0 0 24 24"
							>
								<path
									d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<h2 className="mb-3 font-semibold text-2xl text-white">Sign in to view your servers</h2>
						<p className="mx-auto mb-8 max-w-sm text-white/60">
							Connect with Discord to see all the servers you can configure with Lurkr.
						</p>
						<SignInButton />
					</div>
				</div>
			</div>
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
