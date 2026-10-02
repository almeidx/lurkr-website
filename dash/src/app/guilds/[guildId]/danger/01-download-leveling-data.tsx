"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { ExternalLink } from "@/components/ExternalLink.tsx";
import { FileDownload } from "@/components/icons/mdi/file-download.tsx";
import { LoadingSpinner } from "@/components/LoadingSpinner.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

export function DownloadLevelingData({ guildId, levelingSystemEnabled }: DownloadLevelingDataProps) {
	const [dataExport, setDataExport] = useState<DataExportResult | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		void (async () => {
			try {
				const response = await makeApiRequest(`/levels/${guildId}/export`);

				if (response.ok) {
					const data = (await response.json()) as DataExportResult;
					setDataExport(data);
				}
			} catch {
				// Ignore errors
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
			const response = await makeApiRequest(`/levels/${guildId}/export`, undefined, { method: "POST" });
			if (response.ok) {
				const data = (await response.json()) as DataExportResult;
				setDataExport(data);
			}
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			throw error;
		}
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
