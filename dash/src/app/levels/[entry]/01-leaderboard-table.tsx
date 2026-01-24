import { LeaderboardTableRow } from "@/app/levels/[entry]/02-leaderboard-table-row.tsx";
import type { GetLevelsResponse } from "@/app/levels/[entry]/page.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function LeaderboardTable({ data, guildId, isManager }: LeaderboardTableProps) {
	return (
		<div className="flex flex-1 flex-col gap-3">
			<div className="grid grid-cols-[80px_1fr_100px_100px_100px] gap-4 px-4 py-2 font-semibold text-white/60 text-xs uppercase tracking-wider">
				<div className="text-center">Rank</div>
				<div>User</div>
				<div className="xs:block hidden text-center">Msgs</div>
				<div className="hidden text-center sm:block">Exp</div>
				<div className="text-center">Level</div>
			</div>

			<div className="flex flex-col gap-2">
				{data.map((row) => (
					<LeaderboardTableRow guildId={guildId} isManager={isManager} key={row.userId} row={row} />
				))}
			</div>
		</div>
	);
}
interface LeaderboardTableProps {
	readonly data: GetLevelsResponse["levels"];
	readonly guildId: Snowflake;
	readonly isManager: boolean;
}
