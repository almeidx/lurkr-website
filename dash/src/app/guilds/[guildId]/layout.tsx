import { unstable_rethrow } from "next/navigation";
import type { PropsWithChildren } from "react";
import { api } from "@/lib/api.ts";
import { getUserGuilds } from "@/lib/auth.ts";
import type { GuildMetadata } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import { DashboardMenu } from "./dashboard-menu.tsx";
import { UnknownGuildOrMissingAccess } from "./unknown-guild.tsx";

export default async function DashboardLayout({
	children,
	params,
}: PropsWithChildren<{ params: Promise<{ guildId: Snowflake }> }>) {
	const { guildId } = await params;

	// The page renders alongside this layout and rejects the same ids through `assertGuildId`.
	if (!isSnowflake(guildId)) {
		return <UnknownGuildOrMissingAccess />;
	}

	const [guild, guilds] = await Promise.all([getGuildMetadata(guildId), getBotGuilds()]);

	if (!guild) {
		return <UnknownGuildOrMissingAccess />;
	}

	return (
		<div className="flex justify-center">
			<div className="relative container mt-5 flex">
				<div className="hidden flex-col py-4 md:mr-8 md:flex md:border-r md:border-white/25">
					<DashboardMenu guild={guild} guilds={guilds} />
				</div>

				{children}
			</div>
		</div>
	);
}

// The segment's error.tsx only wraps this layout's children, so the layout handles its own failure.
async function getGuildMetadata(guildId: Snowflake) {
	try {
		return await api.get(`guilds/${guildId}/metadata`, { next: { revalidate: 300 } }).json<GuildMetadata>();
	} catch (error) {
		unstable_rethrow(error);
		console.error("Failed to fetch guild metadata", error);
		return null;
	}
}

async function getBotGuilds() {
	try {
		const guilds = await getUserGuilds();
		return guilds.filter((guild) => guild.botIn);
	} catch (error) {
		unstable_rethrow(error);
		console.error("Failed to fetch the user's guilds", error);
		return [];
	}
}
