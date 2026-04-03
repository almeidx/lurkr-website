"use client";

import { ArrowUpFromLine, Picture, TrashBin } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { api } from "@/lib/api.ts";
import { getUserBackground } from "./get-user-background.ts";

const CropBackgroundDialog = dynamic(() =>
	import("./crop-background-dialog.tsx").then((mod) => ({ default: mod.CropBackgroundDialog })),
);
const DeleteBackgroundDialog = dynamic(() =>
	import("./delete-background-dialog.tsx").then((mod) => ({ default: mod.DeleteBackgroundDialog })),
);

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function BackgroundManager({ initialUrl }: { readonly initialUrl: string | null }) {
	const [backgroundUrl, setBackgroundUrl] = useState(initialUrl);
	const [error, setError] = useState<string | null>(null);
	const [pendingFile, setPendingFile] = useState<File | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const isDragging = useRef(false);
	const dropzoneRef = useRef<HTMLButtonElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	function validateAndOpenCrop(file: File) {
		if (!ACCEPTED_TYPES.includes(file.type)) {
			setError("Invalid file type. Supported: JPEG, PNG, WebP.");
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			setError("File too large. Maximum size is 5 MB.");
			return;
		}

		setError(null);
		setPendingFile(file);
	}

	function closeCropModal() {
		setPendingFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	async function handleCropConfirm(croppedFile: File) {
		const formData = new FormData();
		formData.append("file", croppedFile);

		await api.post("users/@me/background", { body: formData });

		const url = await getUserBackground();
		if (url) setBackgroundUrl(url);

		closeCropModal();
	}

	async function handleDeleteConfirm() {
		await api.delete("users/@me/background");
		setBackgroundUrl(null);
		setDeleteModalOpen(false);
	}

	function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) validateAndOpenCrop(file);
	}

	function setDragActive(active: boolean) {
		isDragging.current = active;
		if (!dropzoneRef.current) return;
		dropzoneRef.current.classList.toggle("border-primary", active);
		dropzoneRef.current.classList.toggle("bg-primary/10", active);
		dropzoneRef.current.classList.toggle("border-white/15", !active);
		dropzoneRef.current.classList.toggle("bg-white/3", !active);
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		setDragActive(false);
		const file = event.dataTransfer.files[0];
		if (file) validateAndOpenCrop(file);
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (!isDragging.current) setDragActive(true);
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		setDragActive(false);
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<div className="flex items-center gap-2">
						<Picture className="size-5 text-white/60" />
						<h3 className="font-semibold text-xl">Background Image</h3>
					</div>
					<p className="text-sm text-white/50">Used as the background of your rank card.</p>
				</div>

				{backgroundUrl && (
					<div className="flex gap-2">
						<Button className="font-medium" onPress={() => fileInputRef.current?.click()} size="sm" variant="secondary">
							<ArrowUpFromLine className="size-4" />
							Replace
						</Button>
						<Button onPress={() => setDeleteModalOpen(true)} size="sm" variant="danger">
							<TrashBin className="size-4" />
						</Button>
					</div>
				)}
			</div>

			<input
				accept={ACCEPTED_TYPES.join(",")}
				className="hidden"
				onChange={handleFileInput}
				ref={fileInputRef}
				type="file"
			/>

			{backgroundUrl ? (
				<div className="overflow-hidden rounded-xl border border-white/10">
					<Image
						alt="Your rank card background"
						className="aspect-4/1 w-full object-cover"
						height={240}
						priority
						src={backgroundUrl}
						unoptimized
						width={960}
					/>
				</div>
			) : (
				<button
					className="flex aspect-4/2 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-white/15 border-dashed bg-white/3 transition-colors hover:border-white/30 hover:bg-white/5 sm:aspect-4/1"
					onClick={() => fileInputRef.current?.click()}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					ref={dropzoneRef}
					type="button"
				>
					<div className="flex flex-col items-center gap-2 text-white/40">
						<ArrowUpFromLine className="size-8" />
						<p className="text-sm">Drag & drop or click to upload</p>
						<p className="text-white/25 text-xs">JPEG, PNG, or WebP. Max 5 MB.</p>
					</div>
				</button>
			)}

			{error && <p className="text-red text-sm">{error}</p>}

			{pendingFile && (
				<CropBackgroundDialog file={pendingFile} onClose={closeCropModal} onConfirm={handleCropConfirm} />
			)}

			{deleteModalOpen && (
				<DeleteBackgroundDialog onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} />
			)}
		</div>
	);
}
