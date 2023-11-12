import { GuildInfo } from "@/app/guilds/page.tsx";
import { API_URL, TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { cookies } from "next/headers";
import type { PropsWithChildren } from "react";
import { Menu } from "./menu.tsx";

export default async function DashboardLayout({
	children,
	params,
}: PropsWithChildren<{ params: { guildId: Snowflake } }>) {
	const { guildId } = params;
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guild, guilds } = await getData(guildId, token);

	return (
		<div className="relative flex">
			<div className="flex flex-col md:mr-8 md:border-r md:border-white/25 py-4">
				<Menu guild={guild} guilds={guilds} />
			</div>

			{children}
		</div>
	);
}

async function getData(guildId: Snowflake, token: string) {
	const [metadataResponse, guildsResponse] = await Promise.all([
		fetch(`${API_URL}/guilds/${guildId}/metadata`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			next: {
				revalidate: 300, // 5 minutes
			},
		}),
		fetch(`${API_URL}/guilds/@me?withPermissions=true`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			next: {
				revalidate: 60,
			},
		}),
	]);

	if (!metadataResponse.ok) {
		throw new Error("Failed to get guild information");
	}

	const guilds = ((await guildsResponse.json()) as GuildInfo[]).filter((guild) => guild.botIn);

	return {
		guild: (await metadataResponse.json()) as GuildMetadataResult,
		guilds,
	};
}

export interface GuildMetadataResult {
	readonly id: Snowflake;
	readonly icon: string | null;
	readonly name: string;
	readonly premium: boolean;
}
