"use client";

import { isHTTPError } from "ky";
import { type DragEvent, useRef, useState } from "react";
import { Confirmation } from "@/components/Confirmation.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { Section } from "@/components/dashboard/Section.tsx";
import { Done } from "@/components/icons/mdi/done.tsx";
import { ErrorOutline } from "@/components/icons/mdi/error-outline.tsx";
import { SystemUpdate } from "@/components/icons/mdi/system-update.tsx";
import { Upload } from "@/components/icons/mdi/upload.tsx";
import { LoadingSpinner } from "@/components/LoadingSpinner.tsx";
import { api } from "@/lib/api.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { IMPORT_BUTTON_CLASS_NAME, ImportConfirmationMessage } from "./begin-import-button.tsx";

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

		const body = new FormData();
		body.append("file", file);

		try {
			// The response only arrives once the whole import has run, which can outlast the default timeout.
			const { count } = await api
				.post(`levels/${guildId}/import/lurkr`, { body, timeout: false })
				.json<{ count: number }>();
			setImportState({ count, status: "success" });
			setFile(null);
		} catch (error) {
			if (!isHTTPError<{ message?: string }>(error)) {
				setImportState({ message: "Failed to connect to the server. Please try again.", status: "error" });
			} else if (error.response.status === 429) {
				setImportState({ message: "Import is rate limited. Please try again later.", status: "error" });
			} else {
				const message = typeof error.data === "object" ? error.data.message : undefined;
				setImportState({ message: message ?? "An error occurred during import.", status: "error" });
			}
		}
	}

	const isUploading = importState.status === "uploading";

	return (
		<Section name="Import Lurkr leveling backup" tooltip="Import your own Lurkr leveling data backup">
			<Label sub="Restore leveling data from a previous export">Upload your Lurkr export file</Label>

			<div className="mt-2 flex flex-col gap-4">
				<div
					className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-white/25 p-6 transition-colors hover:border-white/50"
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
					// oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- drag-and-drop dropzone; a button element cannot host drop handlers
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
					className={IMPORT_BUTTON_CLASS_NAME}
					disabled={!file || isUploading}
					onConfirm={handleImport}
				>
					<ImportConfirmationMessage />
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
