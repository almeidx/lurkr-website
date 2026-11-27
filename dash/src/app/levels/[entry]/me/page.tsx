import { isHTTPError } from "ky";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLeaderboardEntry } from "@/app/levels/[entry]/leaderboard-entry.ts";
import { type GetMyMonthlyProgressResponse, MessageCounts } from "@/app/levels/[entry]/me/message-counts.tsx";
import { api } from "@/lib/api.ts";

export const metadata: Metadata = {
	description: "View your leveling progress over time.",
	title: "Your Leveling Progress",
};

export default async function MyLevel({ params }: { params: Promise<{ entry: string }> }) {
	const { entry } = await params;

	if (!isLeaderboardEntry(entry)) {
		notFound();
	}

	const data = await getData(entry);

	if (!data) {
		return <NotLoggedIn />;
	}

	return (
		<div className="mx-auto my-4 max-w-7xl space-y-6">
			<header className="space-y-2">
				<h1 className="text-xl font-bold">Leveling Progress</h1>
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
		<div className="flex w-full flex-col gap-5 p-4">
			<p>You must be logged in to view your leveling progress.</p>
		</div>
	);
}

async function getData(entry: string) {
	try {
		return await api
			.get(`levels/${entry}/users/@me/monthly-progress`, { next: { revalidate: 60 } })
			.json<GetMyMonthlyProgressResponse>();
	} catch (error) {
		if (isHTTPError(error) && error.response.status === 401) {
			return null;
		}

		throw error;
	}
}
