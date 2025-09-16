import type { Metadata } from "next";
import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { SignInRequired } from "../sign-in-required.tsx";
import { type GetImportStatusResponse, ImportForm } from "./01-leveling-import.tsx";

export default async function Miscellaneous({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;

	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		return <SignInRequired />;
	}

	const data = await getData(guildId, token);

	return <ImportForm data={data} guildId={guildId} />;
}

export const metadata: Metadata = {
	description: "Import your leveling data from another bot into Lurkr!",
	title: "Import Leveling Dashboard",
};

async function getData(guildId: Snowflake, token: string) {
	try {
		const response = await makeApiRequest(`/levels/${guildId}/import`, token, {
			next: {
				revalidate: 15,
				tags: [`import-status:${guildId}`],
			},
		});

		if (!response.ok) {
			return null;
		}

		return response.json() as Promise<GetImportStatusResponse>;
	} catch {
		return null;
	}
}
