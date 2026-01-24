import { LeaderboardTableRow } from "@/app/levels/[entry]/02-leaderboard-table-row.tsx";
import type { GetLevelsResponse } from "@/app/levels/[entry]/page.tsx";
import { PodiumRow } from "@/app/levels/[entry]/podium-row.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function LeaderboardTable({ data, guildId, isManager, page }: LeaderboardTableProps) {
	const isFirstPage = page === 1;
	// Only show podium if we're on page 1 and the first 3 entries are actually ranks 1, 2, 3
	const topThree =
		isFirstPage && data.length >= 3 && data[0].rank === 1 && data[1].rank === 2 && data[2].rank === 3
			? data.slice(0, 3)
			: [];
	const restOfData = topThree.length === 3 ? data.slice(3) : data;

	return (
		<div className="flex flex-col gap-3">
			{topThree.length === 3 && <PodiumRow data={topThree} guildId={guildId} isManager={isManager} />}
			{restOfData.map((row) => (
				<LeaderboardTableRow guildId={guildId} isManager={isManager} key={row.userId} row={row} />
			))}
		</div>
	);
}
interface LeaderboardTableProps {
	readonly data: GetLevelsResponse["levels"];
	readonly guildId: Snowflake;
	readonly isManager: boolean;
	readonly page: number;
}
