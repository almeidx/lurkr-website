import fallbackAvatarImg from "@/assets/fallback-avatar.png";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { QuestionMark } from "@/components/QuestionMark.tsx";
import { getUser } from "@/lib/auth.ts";
import { DOCS_URL, TOKEN_COOKIE } from "@/utils/constants.ts";
import { type Snowflake, userAvatar } from "@/utils/discord-cdn.ts";
import { getTimePeriod } from "@/utils/get-time-period.ts";
import { greeting } from "@/utils/greeting.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ItemStatus } from "./item-status.tsx";
import { resolveOverviewStatuses } from "./resolve-overview-statuses.ts";

export default async function Dashboard({ params }: { readonly params: { guildId: string } }) {
	const { avatar, globalName, id, username } = getUser();
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const overview = await getOverviewStatus(params.guildId, token);

	const statuses = resolveOverviewStatuses(overview);

	return (
		<div className="mb-4 flex flex-col p-4">
			<div className="flex h-fit gap-5">
				<ImageWithFallback
					alt="Your profile picture"
					className="hidden md:block size-28 rounded-full"
					fallback={fallbackAvatarImg}
					height={100}
					src={userAvatar(id, avatar)}
					width={100}
					unoptimized={Boolean(avatar)}
				/>

				<div>
					<h2 className="mb-4 text-2xl font-semibold">{greeting(globalName ?? username)}</h2>

					<p className="whitespace-pre-wrap text-xl tracking-tighter text-white/75">
						What would you like to configure {getTimePeriod()}?{"\n"}
						Below you can find a troubleshooting overview to see if any changes are necessary to your server!
					</p>
				</div>
			</div>

			<h3 className="mb-4 mt-10 flex items-center gap-2 text-2xl font-semibold">
				Configuration Overview
				<QuestionMark href={`${DOCS_URL}/config-commands/config/troubleshoot`} />
				<span className="inline-block bg-red text-white text-sm px-2 rounded-full uppercase font-bold ml-2">BETA</span>
			</h3>

			<p className="text-xl tracking-tighter text-white/75">Click on the glowing options to find out more!</p>

			<div className="mt-6 md:mt-12 flex max-w-6xl flex-wrap gap-x-8 gap-y-6 md:gap-y-10">
				{statuses.map(({ description, name, type }) => (
					<ItemStatus key={name} name={name} description={description} type={type} />
				))}
			</div>
		</div>
	);
}

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Configure your server with Lurkr!",
};

async function getOverviewStatus(guildId: Snowflake, token: string) {
	const response = await makeApiRequest(`/guilds/${guildId}/overview`, token, {
		next: {
			tags: [`settings:${guildId}`],
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch overview status");
	}

	return response.json() as Promise<GetGuildOverviewResult>;
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
