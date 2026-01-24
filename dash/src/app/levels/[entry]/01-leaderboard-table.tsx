import { LeaderboardTableRow } from "@/app/levels/[entry]/02-leaderboard-table-row.tsx";
import type { GetLevelsResponse } from "@/app/levels/[entry]/page.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function LeaderboardTable({ data, guildId, isManager }: LeaderboardTableProps) {
	return (
		<div className="flex flex-col gap-3">
			{data.map((row) => (
				<LeaderboardTableRow guildId={guildId} isManager={isManager} key={row.userId} row={row} />
			))}
		</div>
	);
}
interface LeaderboardTableProps {
	readonly data: GetLevelsResponse["levels"];
	readonly guildId: Snowflake;
	readonly isManager: boolean;
}
