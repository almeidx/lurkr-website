import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { isSnowflake } from "@/utils/is-snowflake.ts";
import { makeApiRequest } from "@/utils/make-api-request";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params: { guildId } }: { params: { guildId: string } }) {
	const token = request.cookies.get(TOKEN_COOKIE)?.value;
	if (!token) {
		return Response.json({ message: "Unauthorized" }, { status: 401 });
	}

	if (!isSnowflake(guildId)) {
		return Response.json({ message: "Invalid guild id" }, { status: 400 });
	}

	const response = await makeApiRequest(`/levels/${guildId}/export`, token);

	if (!response.ok) {
		return new Response(await response.text(), {
			headers: {
				"Content-Type": response.headers.get("Content-Type") ?? "text/plain",
			},
			status: response.status,
		});
	}

	const filename = response.headers.get("X-Filename") ?? `leveling-data-${guildId}.json`;

	return new Response(await response.blob(), {
		headers: {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename="${filename}"`,
		},
	});
}
