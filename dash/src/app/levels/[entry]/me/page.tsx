import { cookies } from "next/headers";
import { type GetMyMonthlyProgressResponse, MessageCounts } from "@/app/levels/[entry]/me/message-counts.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

export default async function MyLevel({ params }: { params: Promise<{ entry: string }> }) {
	const { entry } = await params;

	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		return <NotLoggedIn />;
	}

	const data = token ? await getData(entry, token) : null;

	if (!data) {
		return <p>Failed to load data</p>;
	}

	return (
		<div className="mx-auto my-4 max-w-7xl space-y-6">
			<header className="space-y-2">
				<h1 className="font-bold text-xl">Leveling Progress</h1>
				<p>Below you can find your leveling progress in the [imagine a server name] server.</p>
			</header>

			<div className="mx-auto h-64 w-full">
				<p>Number of messages that qualified for experience points each day.</p>

				<MessageCounts data={data} />
			</div>
		</div>
	);
}

function NotLoggedIn() {
	return (
		<div className="flex w-full flex-col gap-5 px-4 py-4">
			<p>You must be logged in to view your leveling progress.</p>
		</div>
	);
}

async function getData(entry: string, token: string) {
	const response = await makeApiRequest(`/levels/${entry}/users/@me/monthly-progress`, token, {
		next: {
			revalidate: 60,
			tags: [`levels:${entry}:progress`],
		},
	});

	if (!response.ok) {
		return null;
	}

	return response.json() as Promise<GetMyMonthlyProgressResponse>;
}
