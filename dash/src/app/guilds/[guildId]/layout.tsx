import { cookies } from "next/headers";
import type { PropsWithChildren } from "react";
import type { GuildInfo } from "@/app/guilds/page.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { DashboardMenu } from "./dashboard-menu.tsx";
import { UnknownGuildOrMissingAccess } from "./unknown-guild.tsx";

export default async function DashboardLayout({
	children,
	params,
}: PropsWithChildren<{ params: Promise<{ guildId: Snowflake }> }>) {
	const { guildId } = await params;

	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		return <UnknownGuildOrMissingAccess>{children}</UnknownGuildOrMissingAccess>;
	}

	const { guild, guilds } = await getData(guildId, token);

	if (!guild) {
		return <UnknownGuildOrMissingAccess>{children}</UnknownGuildOrMissingAccess>;
	}

	return (
		<div className="px-4 lg:px-6">
			<div className="relative mt-5 flex w-full">
				<div className="hidden md:flex md:border-white/20 md:border-r md:pr-6">
					<DashboardMenu guild={guild} guilds={guilds} />
				</div>

				<div className="min-w-0 flex-1 md:pl-6">{children}</div>
			</div>
		</div>
	);
}

async function getData(guildId: Snowflake, token: string) {
	const [metadataResponse, guildsResponse] = await Promise.all([
		makeApiRequest(`/guilds/${guildId}/metadata`, token, {
			next: {
				revalidate: 300, // 5 minutes
			},
		}),
		makeApiRequest("/users/@me/guilds", token, {
			next: {
				revalidate: 60, // 1 minute
			},
		}),
	]);

	if (!metadataResponse.ok) {
		console.error("Failed to fetch guild metadata", metadataResponse.status, await metadataResponse.text());
	}

	const guilds = guildsResponse.ok ? ((await guildsResponse.json()) as GuildInfo[]).filter((guild) => guild.botIn) : [];
	const guild = metadataResponse.ok ? ((await metadataResponse.json()) as GuildMetadataResult) : null;

	return { guild, guilds };
}

export interface GuildMetadataResult {
	readonly id: Snowflake;
	readonly icon: string | null;
	readonly name: string;
	readonly premium: boolean;
}
