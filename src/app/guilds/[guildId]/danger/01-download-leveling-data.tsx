import type { Snowflake } from "@/utils/discord-cdn.ts";
import { FileDownload } from "@mui/icons-material";
import clsx from "clsx";

export function DownloadLevelingData({ guildId, levelingSystemEnabled }: DownloadLevelingDataProps) {
	return (
		<a
			className={clsx(
				"flex w-fit items-center gap-2 rounded-lg bg-light-gray px-2 py-1 font-semibold text-lg text-shadow-regular md:text-xl",
				!levelingSystemEnabled && "pointer-events-none opacity-50",
			)}
			href={levelingSystemEnabled ? `/api/guilds/${guildId}/export-levels` : `/guilds/${guildId}/danger`}
			download=""
			data-disable-nprogress={true}
		>
			Download
			<FileDownload className="drop-shadow-regular" />
		</a>
	);
}

interface DownloadLevelingDataProps {
	readonly guildId: Snowflake;
	readonly levelingSystemEnabled: boolean;
}
