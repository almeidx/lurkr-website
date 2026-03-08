import { Fingerprint, Globe, Person } from "@gravity-ui/icons";
import { Card, Chip } from "@heroui/react";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { api } from "@/lib/api.ts";
import { getCurrentUser, PremiumTier } from "@/lib/auth.ts";
import type { UserGuildInfo } from "@/lib/guild.ts";
import { userAvatar } from "@/utils/discord-cdn.ts";
import { greeting } from "@/utils/greeting.ts";
import { AccentColorPicker } from "./accent-color-picker.tsx";
import { ApiKeys } from "./api-keys.tsx";
import { BackgroundManager } from "./background-manager.tsx";
import { getUserBackground } from "./get-user-background.ts";
import { PremiumGuildManager } from "./premium-guild-manager.tsx";

export default async function ProfilePage() {
	const [userResult, backgroundResult, guildsResult] = await Promise.allSettled([
		getCurrentUser(),
		getUserBackground(),
		getUserGuilds(),
	]);

	if (userResult.status !== "fulfilled" || !userResult.value) {
		return <NotLoggedIn />;
	}

	const user = userResult.value;
	const backgroundUrl = backgroundResult.status === "fulfilled" ? backgroundResult.value : null;
	const guilds = guildsResult.status === "fulfilled" ? guildsResult.value : [];
	const locale = user.locale ? new Intl.DisplayNames([user.locale], { type: "language" }).of(user.locale) : null;
	const avatarUrl = userAvatar(user.id, user.avatar, { size: 256 });

	return (
		<div className="container mx-auto w-full max-w-4xl space-y-6 px-4 py-8">
			<Card className="border border-white/10">
				<Card.Content className="px-6 py-6 sm:px-8">
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
						<div className="shrink-0 overflow-hidden rounded-full">
							<ImageWithFallback
								alt={`${user.globalName ?? user.username}'s avatar`}
								className="size-24 rounded-full sm:size-28"
								height={112}
								src={avatarUrl}
								unoptimized={Boolean(user.avatar)}
								width={112}
							/>
						</div>

						<div className="flex flex-1 flex-col items-center gap-3 pb-1 sm:items-start">
							<div className="text-center sm:text-left">
								<h1 className="font-bold text-2xl leading-tight">{greeting(user.globalName ?? user.username)}</h1>
								<p className="text-sm text-white/50">Manage your profile settings and rank card customization.</p>
							</div>

							<div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
								<Chip size="sm" variant="soft">
									<span className="flex items-center gap-1.5">
										<Person className="size-3.5" />@{user.username}
										{user.discriminator !== "0" && `#${user.discriminator}`}
									</span>
								</Chip>

								<Chip className="font-mono" size="sm" variant="soft">
									<span className="flex items-center gap-1.5">
										<Fingerprint className="size-3.5" />
										{user.id}
									</span>
								</Chip>

								{locale && (
									<Chip size="sm" variant="soft">
										<span className="flex items-center gap-1.5">
											<Globe className="size-3.5" />
											{locale}
										</span>
									</Chip>
								)}

								{user.premium !== PremiumTier.None && (
									<Chip className="bg-gradient-lurkr font-semibold text-black" size="sm">
										{user.premium}
									</Chip>
								)}
							</div>
						</div>
					</div>
				</Card.Content>
			</Card>

			<Card className="border border-white/10">
				<Card.Content className="space-y-4 p-6">
					<BackgroundManager initialUrl={backgroundUrl} />
				</Card.Content>
			</Card>

			<Card className="border border-white/10">
				<Card.Content className="space-y-4 p-6">
					<AccentColorPicker initialColor={user.accentColour} />
				</Card.Content>
			</Card>

			<Card className="border border-white/10">
				<Card.Content className="space-y-4 p-6">
					<PremiumGuildManager guilds={guilds} premium={user.premium} premiumGuild={user.premiumGuild} />
				</Card.Content>
			</Card>

			<Card className="border border-white/10">
				<Card.Content className="space-y-4 p-6">
					<ApiKeys guilds={guilds} />
				</Card.Content>
			</Card>
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

async function getUserGuilds() {
	try {
		const guilds = await api
			.get("users/@me/guilds", {
				next: { revalidate: 60 },
				searchParams: { botIn: "true", isAdmin: "true" },
			})
			.json<UserGuildInfo[]>();

		return guilds.filter((guild) => guild.botIn);
	} catch {
		return [];
	}
}
