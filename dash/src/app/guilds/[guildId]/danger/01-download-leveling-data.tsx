"use client";

import clsx from "clsx";
import { isHTTPError } from "ky";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { FileDownload } from "@/components/icons/mdi/file-download.tsx";
import { LoadingSpinner } from "@/components/LoadingSpinner.tsx";
import { api } from "@/lib/api.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { extractErrorMessage } from "@/utils/extract-error-message.ts";

export function DownloadLevelingData({ guildId, levelingSystemEnabled }: DownloadLevelingDataProps) {
	const [dataExport, setDataExport] = useState<DataExportResult | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		void (async () => {
			try {
				setDataExport(await api.get(`levels/${guildId}/export`).json<DataExportResult>());
			} catch (error) {
				if (!isHTTPError(error) || error.response.status !== 404) {
					console.error("Failed to fetch the leveling data export", error);
				}
			}
			setIsLoading(false);
		})();
	}, [guildId]);

	async function handleCreateExport() {
		if (!levelingSystemEnabled || isLoading) {
			return;
		}

		setIsLoading(true);

		try {
			setDataExport(await api.post(`levels/${guildId}/export`).json<DataExportResult>());
		} catch (error) {
			toast.error(extractErrorMessage(error, "Failed to create the export."));
		}

		setIsLoading(false);
	}

	if (levelingSystemEnabled && dataExport?.url) {
		return (
			<ExternalLink
				className="text-shadow-regular flex w-fit items-center gap-2 rounded-lg bg-light-gray px-2 py-1 text-lg font-semibold md:text-xl"
				href={dataExport.url}
			>
				Download export
				<FileDownload className="drop-shadow-regular" />
			</ExternalLink>
		);
	}

	return (
		<button
			className={clsx(
				"text-shadow-regular flex w-fit items-center gap-2 rounded-lg bg-light-gray px-2 py-1 text-lg font-semibold md:text-xl",
				(!levelingSystemEnabled || isLoading) && "pointer-events-none opacity-50",
			)}
			disabled={!levelingSystemEnabled || isLoading}
			onClick={handleCreateExport}
			type="button"
		>
			{levelingSystemEnabled ? (
				isLoading ? (
					<>
						Loading…
						<LoadingSpinner />
					</>
				) : (
					<>
						Create export
						<FileDownload className="drop-shadow-regular" />
					</>
				)
			) : (
				"Leveling system is disabled"
			)}
		</button>
	);
}

interface DataExportResult {
	url: string;
}

interface DownloadLevelingDataProps {
	readonly guildId: Snowflake;
	readonly levelingSystemEnabled: boolean;
}
