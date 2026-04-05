"use client";

import { type DragEvent, useRef, useState } from "react";
import { Confirmation } from "@/components/Confirmation.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Done } from "@/components/icons/mdi/done.tsx";
import { ErrorOutline } from "@/components/icons/mdi/error-outline.tsx";
import { SystemUpdate } from "@/components/icons/mdi/system-update.tsx";
import { Upload } from "@/components/icons/mdi/upload.tsx";
import { LoadingSpinner } from "@/components/LoadingSpinner.tsx";
import { API_URL } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";

type ImportState =
	| { status: "idle" }
	| { status: "uploading" }
	| { status: "success"; count: number }
	| { status: "error"; message: string };

export function LurkrImportSection({ guildId }: { guildId: Snowflake }) {
	const [file, setFile] = useState<File | null>(null);
	const isDragging = useRef(false);
	const [importState, setImportState] = useState<ImportState>({ status: "idle" });
	const inputRef = useRef<HTMLInputElement>(null);
	const dropzoneRef = useRef<HTMLDivElement>(null);

	function handleFileSelect(selectedFile: File | null) {
		if (!selectedFile) {
			setFile(null);
			return;
		}

		if (selectedFile.type !== "application/json") {
			setImportState({ message: "Please select a JSON file.", status: "error" });
			return;
		}

		setFile(selectedFile);
		setImportState({ status: "idle" });
	}

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const selectedFile = event.target.files?.[0] ?? null;
		handleFileSelect(selectedFile);
	}

	function setDragActive(active: boolean) {
		isDragging.current = active;
		if (!dropzoneRef.current) return;
		dropzoneRef.current.classList.toggle("border-green", active);
		dropzoneRef.current.classList.toggle("bg-green/10", active);
		dropzoneRef.current.classList.toggle("border-white/25", !active);
		dropzoneRef.current.classList.toggle("hover:border-white/50", !active);
	}

	function handleDragOver(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
		if (!isDragging.current) setDragActive(true);
	}

	function handleDragLeave(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
		setDragActive(false);
	}

	function handleDrop(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
		setDragActive(false);
		const droppedFile = event.dataTransfer.files[0] ?? null;
		handleFileSelect(droppedFile);
	}

	function handleClick() {
		inputRef.current?.click();
	}

	async function handleImport() {
		if (!file) {
			setImportState({ message: "Please select a file first.", status: "error" });
			return;
		}

		setImportState({ status: "uploading" });

		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch(`${API_URL}/levels/${guildId}/import/lurkr`, {
				body: formData,
				credentials: "include",
				method: "POST",
			});

			if (!response.ok) {
				if (response.status === 429) {
					setImportState({ message: "Import is rate limited. Please try again later.", status: "error" });
					return;
				}

				const errorData = await response.json().catch(() => null);
				const errorMessage = errorData?.message ?? "An error occurred during import.";
				setImportState({ message: errorMessage, status: "error" });
				return;
			}

			const result = (await response.json()) as { count: number };
			setImportState({ count: result.count, status: "success" });
			setFile(null);
		} catch {
			setImportState({ message: "Failed to connect to the server. Please try again.", status: "error" });
		}
	}

	const isUploading = importState.status === "uploading";

	return (
		<Section name="Import Lurkr leveling backup" tooltip="Import your own Lurkr leveling data backup">
			<Label sub="Restore leveling data from a previous export">Upload your Lurkr export file</Label>

			<div className="mt-2 flex flex-col gap-4">
				{/* biome-ignore lint/a11y/useSemanticElements: div required for drag and drop support */}
				<div
					className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-white/25 border-dashed p-6 transition-colors hover:border-white/50"
					onClick={handleClick}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onKeyDown={(event) => {
						if (event.key === "Enter" || event.key === " ") {
							handleClick();
						}
					}}
					ref={dropzoneRef}
					role="button"
					tabIndex={0}
				>
					<Upload className="size-8 text-white/50" />

					{file ? (
						<p className="text-center text-white/75">
							Selected: <span className="font-medium text-white">{file.name}</span>
						</p>
					) : (
						<p className="text-center text-white/75">
							Drag and drop your <span className="font-medium text-white">.json</span> file here, or click to browse
						</p>
					)}

					<input
						accept="application/json,.json"
						className="hidden"
						onChange={handleInputChange}
						ref={inputRef}
						type="file"
					/>
				</div>

				<p className="text-sm text-white/50">
					Export your Lurkr leveling data from the Danger Zone tab in the dashboard.
				</p>

				<Confirmation
					buttonText={
						isUploading ? (
							<>
								Importing…
								<LoadingSpinner size={20} />
							</>
						) : (
							<>
								Import
								<SystemUpdate className="size-5 drop-shadow-regular" />
							</>
						)
					}
					className="flex w-fit items-center justify-between gap-3 rounded-lg bg-green px-2 py-1 font-semibold text-lg text-shadow-regular transition-colors hover:bg-green/90 disabled:bg-green/50 md:text-xl"
					disabled={!file || isUploading}
					onConfirm={handleImport}
				>
					Are you sure you want to import leveling data into this server?
					<br />
					<span className="font-bold text-red">
						This is a destructive and irreversible operation which will overwrite any existing data.
					</span>
				</Confirmation>
			</div>

			{importState.status === "success" && (
				<div className="mt-4 flex items-center gap-2">
					<Done className="text-green" />
					<p>Import completed successfully. {importState.count.toLocaleString("en")} users were imported.</p>
				</div>
			)}

			{importState.status === "error" && (
				<div className="mt-4 flex items-center gap-2">
					<ErrorOutline className="text-red" />
					<p>{importState.message}</p>
				</div>
			)}
		</Section>
	);
}
