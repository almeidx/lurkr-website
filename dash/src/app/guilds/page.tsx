import { isHTTPError } from "ky";
import type { Metadata } from "next";
import { DashboardGuildList } from "@/app/guilds/guild-list.tsx";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ErrorState } from "@/components/error-state.tsx";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { SignInButton } from "@/components/navigation/sign-in.tsx";
import { getCurrentUser, getUserGuilds } from "@/lib/auth.ts";
import { userAvatar } from "@/utils/discord-cdn.ts";
import { greeting } from "@/utils/time-of-day.ts";

export default async function GuildList() {
	const [user, guilds] = await Promise.all([getCurrentUser(), getGuilds()]);

	if (!user || !guilds) {
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

	return (
		<div className="flex flex-col items-center gap-2 py-4">
			<header className="mt-3 flex gap-8 px-4 md:px-0">
				<ImageWithFallback
					alt="Your profile picture"
					className="hidden size-28 rounded-full md:block"
					fallback={fallbackAvatarImg}
					height={112}
					src={userAvatar(user.id, user.avatar)}
					unoptimized={Boolean(user.avatar)}
					width={112}
				/>

				<div>
					<h1 className="mb-4 text-2xl font-semibold text-white">{greeting(user.globalName ?? user.username)}</h1>

					<p className="text-xl tracking-tight text-white/75">
						Which server would like to configure today? Below you can find a list of all of your servers you are able to
						configure!
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
	description: "Configure your server with Lurkr!",
	title: "Dashboards",
};

async function getGuilds() {
	try {
		return await getUserGuilds();
	} catch (error) {
		if (isHTTPError(error) && error.response.status === 401) {
			return null;
		}

		throw error;
	}
}
