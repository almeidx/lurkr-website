import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { SignInButton } from "@/components/SignIn.tsx";
import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import type { User } from "@/lib/auth.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { type Snowflake, userAvatar } from "@/utils/discord-cdn.ts";
import { getTimePeriod } from "@/utils/get-time-period.ts";
import { greeting } from "@/utils/greeting.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ItemStatus } from "./item-status.tsx";
import { resolveOverviewStatuses } from "./resolve-overview-statuses.ts";

export default async function Dashboard({ params }: { readonly params: Promise<{ guildId: string }> }) {
	const { guildId } = await params;
	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	const data = await getData(guildId, token);

	if (!data) {
		return (
			<div className="mt-6 flex flex-col items-center gap-2 text-center text-white/75 text-xl tracking-tight">
				You need to be signed in to view this page.
				<SignInButton />
			</div>
		);
	}

	const { overview, user } = data;

	const statuses = resolveOverviewStatuses(overview);

	return (
		<div className="mb-4 flex flex-col p-4">
			<div className="flex h-fit gap-5">
				<ImageWithFallback
					alt="Your profile picture"
					className="hidden size-28 rounded-full md:block"
					fallback={fallbackAvatarImg}
					height={100}
					src={userAvatar(user.id, user.avatar)}
					width={100}
					unoptimized={Boolean(user.avatar)}
				/>

				<div>
					<h2 className="mb-4 font-semibold text-2xl">{greeting(user.globalName ?? user.username)}</h2>

					<p className="whitespace-pre-wrap text-white/75 text-xl tracking-tighter">
						What would you like to configure {getTimePeriod()}?{"\n"}
						Below you can find a troubleshooting overview to see if any changes are necessary to your server!
					</p>
				</div>
			</div>

			<h3 className="mt-10 mb-4 flex items-center gap-2 font-semibold text-2xl">
				Configuration Overview
				<DocsBubble
					path="/config-commands/config/troubleshoot"
					tooltip="Learn more about the config troubleshoot system"
				/>
				<span className="ml-2 inline-block rounded-full bg-red px-2 font-bold text-sm text-white uppercase">BETA</span>
			</h3>

			<p className="text-white/75 text-xl tracking-tighter">Click on the glowing options to find out more!</p>

			<div className="mt-6 flex max-w-6xl flex-wrap gap-x-8 gap-y-6 md:mt-12 md:gap-y-10">
				{statuses.map(({ description, name, type }) => (
					<ItemStatus key={name} name={name} description={description} type={type} />
				))}
			</div>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Dashboard Overview",
	description: "Configure your server with Lurkr!",
};

async function getData(guildId: Snowflake, token: string | undefined) {
	if (!token) {
		return null;
	}

	const [getGuildOverviewResponse, getCurrentUserResponse] = await Promise.all([
		makeApiRequest(`/guilds/${guildId}/overview`, token, {
			next: {
				tags: [`settings:${guildId}`],
				revalidate: 30,
			},
		}),
		makeApiRequest("/users/@me", token, {
			next: {
				revalidate: 60 * 60, // 1 hour
				tags: ["user"],
			},
		}),
	]);

	if (!getGuildOverviewResponse.ok) {
		console.error(
			"Failed to fetch guild overview",
			getGuildOverviewResponse.status,
			await getGuildOverviewResponse.text(),
		);
		return null;
	}

	return {
		overview: (await getGuildOverviewResponse.json()) as GetGuildOverviewResult,
		user: (await getCurrentUserResponse.json()) as User,
	};
}

export interface GetGuildOverviewResult {
	readonly autoPublishChannels: "DISABLED" | "OK";
	readonly autoRole: "DISABLED" | "OK";
	readonly autoRoleFlags: "DISABLED" | "OK";
	readonly emojiList: "DISABLED" | "NO_CHANNEL" | "OK" | "SET_BUT_DISABLED";
	readonly mentionCooldown: "DISABLED" | "NO_ROLES" | "OK";
	readonly milestonesChannel: "DISABLED" | "NO_CHANNEL" | "OK";
	readonly milestonesRoles: "DISABLED" | "OK";
	readonly storeCounts: "DISABLED" | "NOT_ENOUGH_MEMBERS" | "OK";
	readonly topXpRole: "DISABLED" | "OK" | "SET_BUT_DISABLED";
	readonly xpAnnounceOnlyXpRoles: "DISABLED" | "NO_XP_ROLE_REWARDS" | "OK";
	readonly xpAnnouncementChannel: "DISABLED" | "OK";
	readonly xpChannels: "DISABLED" | "OK" | "WHITELIST_EMPTY";
	readonly xpRoleRewards: "DISABLED" | "OK";
}
