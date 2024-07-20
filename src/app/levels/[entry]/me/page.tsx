import { GraphContainer } from "@/app/levels/[entry]/me/container.tsx";
import type { GetMyMonthlyProgressResponse } from "@/app/levels/[entry]/me/message-counts.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { cookies } from "next/headers";

export default async function MyLevel({ params: { entry } }: { params: { entry: string } }) {
	const token = cookies().get(TOKEN_COOKIE)?.value;
	const data = token ? await getData(entry, token) : null;

	if (!data) {
		return <p>Failed to load data</p>;
	}

	return (
		<div className="mx-auto my-4 max-w-7xl space-y-6">
			<header className="space-y-2">
				<h1 className="font-bold text-xl">Leveling Progress</h1>
				<p>Below you can find your leveling progress in the SERVER_NAME server.</p>
			</header>

			<div className="mx-auto h-64 w-full">
				<p>Number of messages that qualified for experience points each day.</p>

				<GraphContainer data={data} />
			</div>
		</div>
	);
}

async function getData(entry: string, token: string) {
	const response = await makeApiRequest(`/levels/${entry}/users/@me/monthly-progress`, token, {
		next: {
			tags: [`levels:${entry}:progress`],
			revalidate: 60,
		},
	});

	if (!response.ok) {
		return null;
	}

	return response.json() as Promise<GetMyMonthlyProgressResponse>;
}
