"use client";

import { LeaderboardTableRow } from "@/app/levels/[entry]/02-leaderboard-table-row";
import type { GetLevelsResponse } from "@/app/levels/[entry]/page";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { useMemo } from "react";

export function LeaderboardTable({ data, guildId, isManager }: LeaderboardTableProps) {
	const data_ = useMemo(
		() => data.map((row) => <LeaderboardTableRow key={row.userId} guildId={guildId} row={row} isManager={isManager} />),
		[data, guildId, isManager],
	);

	return (
		<div className="flex flex-col">
			<div className="flex gap-2 text-sm mb-4">
				<div className="min-w-14 max-w-[15%]">Rank</div>
				<div className="w-full">User</div>
				<div className="hidden xs:block min-w-14 max-w-[15%]">Msgs</div>
				<div className="hidden sm:block min-w-14 max-w-[15%]">Exp</div>
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
