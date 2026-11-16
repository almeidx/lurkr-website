import type { Metadata } from "next";
import fallbackAvatarImg from "@/assets/fallback-avatar.webp";
import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { api } from "@/lib/api.ts";
import type { User } from "@/lib/auth.ts";
import { type Snowflake, userAvatar } from "@/utils/discord-cdn.ts";
import { greeting, timePeriod } from "@/utils/time-of-day.ts";
import { ItemStatus } from "./item-status.tsx";
import { type GuildOverview, resolveOverviewStatuses } from "./resolve-overview-statuses.ts";
import { settingsTag } from "./settings.ts";

export default async function Dashboard({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;
	const [overview, user] = await Promise.all([
		api
			.get(`guilds/${guildId}/overview`, { next: { revalidate: 30, tags: [settingsTag(guildId)] } })
			.json<GuildOverview>(),
		api.get("users/@me").json<User>(),
	]);

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
					unoptimized={Boolean(user.avatar)}
					width={100}
				/>

				<div>
					<h2 className="mb-4 text-2xl font-semibold">{greeting(user.globalName ?? user.username)}</h2>

					<p className="text-xl tracking-tighter whitespace-pre-wrap text-white/75">
						What would you like to configure {timePeriod()}?{"\n"}
						Below you can find a troubleshooting overview to see if any changes are necessary to your server!
					</p>
				</div>
			</div>

			<h3 className="mt-10 mb-4 flex items-center gap-2 text-2xl font-semibold">
				Configuration Overview
				<DocsBubble
					path="/config-commands/config/troubleshoot"
					tooltip="Learn more about the config troubleshoot system"
				/>
				<span className="ml-2 inline-block rounded-full bg-red px-2 text-sm font-bold text-white uppercase">BETA</span>
			</h3>

			<p className="text-xl tracking-tighter text-white/75">Click on the glowing options to find out more!</p>

			<div className="mt-6 flex max-w-6xl flex-wrap gap-x-8 gap-y-6 md:mt-12 md:gap-y-10">
				{statuses.map(({ description, name, type }) => (
					<ItemStatus description={description} key={name} name={name} type={type} />
				))}
			</div>
		</div>
	);
}

export const metadata: Metadata = {
	description: "Configure your server with Lurkr!",
	title: "Dashboard Overview",
};
