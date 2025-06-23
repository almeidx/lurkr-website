import { LeaderboardTableRow } from "@/app/(dashboard)/levels/[entry]/02-leaderboard-table-row.tsx";
import type { GetLevelsResponse } from "@/app/(dashboard)/levels/[entry]/page.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function LeaderboardTable({ data, guildId, isManager }: LeaderboardTableProps) {
	return (
		<div className="flex flex-1 flex-col gap-y-4">
			<div className="flex gap-2 text-sm">
				<div className="min-w-14 max-w-[15%]">Rank</div>
				<div className="w-full">User</div>
				<div className="xs:block hidden min-w-14 max-w-[15%]">Msgs</div>
				<div className="hidden min-w-14 max-w-[15%] sm:block">Exp</div>
				<div className="min-w-14 max-w-[15%]">Level</div>
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
