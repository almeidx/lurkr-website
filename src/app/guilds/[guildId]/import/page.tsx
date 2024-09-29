import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { type GetImportStatusResponse, ImportForm } from "./01-leveling-import.tsx";

export default async function Miscellaneous({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;

	const token = (await cookies()).get(TOKEN_COOKIE)!.value;
	const data = await getData(guildId, token);

	return <ImportForm guildId={guildId} data={data} />;
}

export const metadata: Metadata = {
	title: "Import Leveling Dashboard",
	description: "Import your leveling data from another bot into Lurkr!",
};

async function getData(guildId: Snowflake, token: string) {
	const response = await makeApiRequest(`/levels/${guildId}/import`, token, {
		next: {
			tags: [`import-status:${guildId}`],
			revalidate: 15,
		},
	});

	if (!response.ok) {
		return null;
	}

	return response.json() as Promise<GetImportStatusResponse>;
}
