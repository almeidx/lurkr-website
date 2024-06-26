import type { GuildInfo } from "@/app/guilds/page.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { cookies } from "next/headers";
import type { PropsWithChildren } from "react";
import { DashboardMenu } from "./dashboard-menu.tsx";

export default async function DashboardLayout({
	children,
	params,
}: PropsWithChildren<{ params: { guildId: Snowflake } }>) {
	const { guildId } = params;
	const token = cookies().get(TOKEN_COOKIE)!.value;
	const { guild, guilds } = await getData(guildId, token);

	return (
		<div className="flex justify-center">
			<div className="container relative mt-5 flex">
				<div className="hidden flex-col py-4 md:mr-8 md:flex md:border-white/25 md:border-r">
					<DashboardMenu guild={guild} guilds={guilds} />
				</div>

				{children}
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
		throw new Error("Failed to get guild information");
	}

	const guilds = guildsResponse.ok ? ((await guildsResponse.json()) as GuildInfo[]).filter((guild) => guild.botIn) : [];

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
