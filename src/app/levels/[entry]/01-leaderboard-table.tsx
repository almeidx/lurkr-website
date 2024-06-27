"use client";

import { LeaderboardTableRow } from "@/app/levels/[entry]/02-leaderboard-table-row";
import type { GetLevelsResponse } from "@/app/levels/[entry]/page";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function LeaderboardTable({ data, guildId, isManager }: LeaderboardTableProps) {
	const data_ = data.map((row) => (
		<LeaderboardTableRow key={row.userId} guildId={guildId} row={row} isManager={isManager} />
	));

	return (
		<div className="flex flex-col">
			<div className="mb-4 flex gap-2 text-sm">
				<div className="min-w-14 max-w-[15%]">Rank</div>
				<div className="w-full">User</div>
				<div className="xs:block hidden min-w-14 max-w-[15%]">Msgs</div>
				<div className="hidden min-w-14 max-w-[15%] sm:block">Exp</div>
				<div className="min-w-14 max-w-[15%]">Level</div>
			</div>

			{data_}
		</div>
	);
}
interface LeaderboardTableProps {
	readonly data: GetLevelsResponse["levels"];
	readonly guildId: Snowflake;
	readonly isManager: boolean;
}
