import type { Metadata } from "next";
import { cookies } from "next/headers";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { SignInRequired } from "../sign-in-required.tsx";
import { type GetImportStatusResponse, ImportForm } from "./01-leveling-import.tsx";
import { LurkrImportSection } from "./05-lurkr-import-section.tsx";

export default async function Miscellaneous({ params }: { readonly params: Promise<{ guildId: Snowflake }> }) {
	const { guildId } = await params;

	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		return <SignInRequired />;
	}

	const data = await getData(guildId, token);

	return (
		<div className="flex w-full flex-col gap-5 px-4 py-4">
			<div className="space-y-2">
				<h2 className="font-semibold text-2xl">Import Bots</h2>
			</div>

			<div className="mb-12 flex flex-col gap-4">
				<ImportForm data={data} guildId={guildId} />
				<LurkrImportSection guildId={guildId} />
			</div>
		</div>
	);
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
