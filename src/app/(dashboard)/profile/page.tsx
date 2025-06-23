import "react-medium-image-zoom/dist/styles.css";

import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { Section } from "@/components/dashboard/Section.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { getCurrentUser, UserAccentType } from "@/lib/auth.ts";
import type { UserGuildInfo } from "@/lib/guild.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { userAvatar } from "@/utils/discord-cdn.ts";
import { greeting } from "@/utils/greeting.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { ApiKeys } from "./api-keys.tsx";

const Zoom = dynamic(() => import("react-medium-image-zoom"));

export default async function ProfilePage() {
	const cookieJar = await cookies();
	const token = cookieJar.get(TOKEN_COOKIE)?.value;
	if (!token) {
		return <NotLoggedIn />;
	}

	const [userResult, backgroundResult, guildsResult] = await Promise.allSettled([
		getCurrentUser(token),
		getUserBackground(token),
		getUserGuilds(token),
	]);

	if (userResult.status !== "fulfilled" || !userResult.value) {
		return <NotLoggedIn />;
	}

	const user = userResult.value;
	const background = backgroundResult.status === "fulfilled" ? backgroundResult.value : null;

	const locale = user.locale ? new Intl.DisplayNames([user.locale], { type: "language" }).of(user.locale) : null;

	const guilds = guildsResult.status === "fulfilled" ? guildsResult.value : [];

	return (
		<div className="container mx-auto w-full max-w-5xl space-y-8 px-4 py-6">
			<div className="flex h-fit items-center gap-5">
				<ImageWithFallback
					alt="Your profile picture"
					className="hidden size-28 rounded-full md:block"
					height={100}
					src={userAvatar(user.id, user.avatar)}
					unoptimized={Boolean(user.avatar)}
					width={100}
				/>

				<div>
					<h1 className="mb-4 font-semibold text-2xl">{greeting(user.globalName ?? user.username)}</h1>

					<p className="whitespace-pre-wrap text-white/75 text-xl tracking-tighter">
						Here you can view and manage your profile settings.
					</p>
				</div>
			</div>

			<Section>
				<div className="flex flex-col justify-between gap-2 md:flex-row">
					<div>
						<h2 className="font-bold text-2xl">{user.globalName ?? user.username}</h2>
						<div className="flex items-center gap-1 text-gray-400">
							<span>@{user.username}</span>
							{user.discriminator !== "0" && <span>#{user.discriminator}</span>}
						</div>
					</div>

					<span aria-hidden className="font-mono text-sm">
						{user.id}
					</span>
				</div>

				{locale ? (
					<div className="flex items-center gap-1">
						<Text>Your locale is set to {locale}.</Text>
					</div>
				) : null}
			</Section>

			<Section>
				<div className="flex items-center justify-between">
					<h3 className="font-semibold text-xl">Background Image</h3>

					{/* TODO: Add a button for uploading a new background image */}
				</div>

				{background ? (
					<div className="rounded-lg border border-zinc-800">
						<Zoom zoomImg={{ src: background.url }} zoomMargin={20}>
							<ImageWithFallback
								alt="Your background"
								className="aspect-4/1 w-full object-cover"
								height={260}
								src={background.url || "/placeholder.svg"}
								width={950}
							/>
						</Zoom>
					</div>
				) : (
					<div className="flex h-56 items-center justify-center rounded-lg border border-zinc-800 border-dashed bg-darker">
						<div className="flex flex-col items-center gap-1 text-center">
							<p className="text-gray-400 text-sm">No background image set</p>
						</div>
					</div>
				)}

				<p className="text-gray-400 text-sm">This image is used as the background of your rank card.</p>
			</Section>

			<Section>
				<h3 className="font-semibold text-xl">Accent Color</h3>

				<div className="flex flex-col gap-3">
					{user.accentColour === UserAccentType.HighestRole ? (
						<Text>The color of your highest role in the server.</Text>
					) : user.accentType === UserAccentType.Custom ? (
						<div className="flex items-center gap-1">
							<Text>Your accent color is {user.accentColour!}</Text>
							<div className="h-5 w-5 rounded-full" style={{ backgroundColor: user.accentColour! }} />
						</div>
					) : (
						<Text>Your accent color is calculated from your profile picture.</Text>
					)}

					<p className="text-gray-400 text-sm">This color is used as the progress bar color of your rank card.</p>
				</div>
			</Section>

			<Section>
				<ApiKeys guilds={guilds} />
			</Section>
		</div>
	);
}

function NotLoggedIn() {
	return (
		<div className="flex w-full flex-col gap-5 px-4 py-4">
			<p>You must be logged in to view your profile.</p>
		</div>
	);
}

// #region Data fetchers

async function getUserBackground(token: string) {
	const response = await makeApiRequest("/users/@me/background", token, {
		headers: {
			"X-Api-Key": process.env.BACKGROUNDS_KEY_HEADER!,
		},
	});
	if (!response.ok) {
		return null;
	}

	return response.json() as Promise<UserBackgroundResult>;
}

async function getUserGuilds(token: string) {
	const response = await makeApiRequest("/users/@me/guilds?isAdmin=true&botIn=true", token, {
		next: {
			revalidate: 60, // 1 minute
		},
	});
	if (!response.ok) {
		return [];
	}

	const guilds = (await response.json()) as UserGuildInfo[];

	return guilds.filter((guild) => guild.botIn);
}

// #endregion

interface UserBackgroundResult {
	url: string;
}
