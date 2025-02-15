"use client";

import { ExternalLink } from "@/components/ExternalLink.tsx";
import { LoadingSpinner } from "@/components/LoadingSpinner.tsx";
import { FileDownload } from "@/components/icons/mdi/file-download.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import clsx from "clsx";
import { useEffect, useState } from "react";

export function DownloadLevelingData({ guildId, levelingSystemEnabled, token }: DownloadLevelingDataProps) {
	const [dataExport, setDataExport] = useState<DataExportResult | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Intended
	useEffect(() => {
		(async () => {
			try {
				const response = await makeApiRequest(`/levels/${guildId}/export`, token);

				if (response.ok) {
					const data = (await response.json()) as DataExportResult;
					setDataExport(data);
				}
			} catch {
				// Ignore errors
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	async function handleCreateExport() {
		if (!levelingSystemEnabled || isLoading) {
			return;
		}

		setIsLoading(true);

		try {
			const response = await makeApiRequest(`/levels/${guildId}/export`, token, { method: "POST" });
			if (response.ok) {
				const data = (await response.json()) as DataExportResult;
				setDataExport(data);
			}
		} finally {
			setIsLoading(false);
		}
	}

	if (levelingSystemEnabled && dataExport?.url) {
		return (
			<ExternalLink
				className="flex w-fit items-center gap-2 rounded-lg bg-light-gray px-2 py-1 font-semibold text-lg text-shadow-regular md:text-xl"
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
				"flex w-fit items-center gap-2 rounded-lg bg-light-gray px-2 py-1 font-semibold text-lg text-shadow-regular md:text-xl",
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
	readonly token: string;
}
