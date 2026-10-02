import { LeaderboardTableRow } from "@/app/levels/[entry]/02-leaderboard-table-row.tsx";
import type { GetLevelsResponse } from "@/app/levels/[entry]/page.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function LeaderboardTable({ data, guildId, isManager }: LeaderboardTableProps) {
	return (
		<div className="flex flex-1 flex-col gap-y-4">
			<div className="flex gap-2 text-sm">
				<div className="max-w-[15%] min-w-14">Rank</div>
				<div className="w-full">User</div>
				<div className="hidden max-w-[15%] min-w-14 xs:block">Msgs</div>
				<div className="hidden max-w-[15%] min-w-14 sm:block">Exp</div>
				<div className="max-w-[15%] min-w-14">Level</div>
			</div>

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
