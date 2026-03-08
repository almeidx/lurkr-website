"use client";

import { ArrowUpFromLine, Picture, TrashBin } from "@gravity-ui/icons";
import { Button, Modal } from "@heroui/react";
import Image from "next/image";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { api } from "@/lib/api.ts";
import { getUserBackground } from "./get-user-background.ts";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function BackgroundManager({ initialUrl }: { readonly initialUrl: string | null }) {
	const [backgroundUrl, setBackgroundUrl] = useState(initialUrl);
	const [isUploading, setIsUploading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	function validateAndUpload(file: File) {
		if (!ACCEPTED_TYPES.includes(file.type)) {
			setError("Invalid file type. Supported: JPEG, PNG, WebP.");
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			setError("File too large. Maximum size is 5 MB.");
			return;
		}

		uploadFile(file);
	}

	function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file) validateAndUpload(file);
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		setIsDragging(false);
		const file = event.dataTransfer.files[0];
		if (file) validateAndUpload(file);
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		setIsDragging(true);
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		setIsDragging(false);
	}

	async function uploadFile(file: File) {
		setError(null);
		setIsUploading(true);

		try {
			const formData = new FormData();
			formData.append("file", file);

			await api.post("users/@me/background", { body: formData });

			const url = await getUserBackground();
			if (url) {
				setBackgroundUrl(url);
			}
		} catch {
			setError("Failed to upload background.");
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	}

	async function handleDelete() {
		setError(null);
		setIsDeleting(true);

		try {
			await api.delete("users/@me/background");
			setBackgroundUrl(null);
		} catch {
			setError("Failed to delete background.");
		} finally {
			setIsDeleting(false);
			setDeleteModalOpen(false);
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<div className="flex items-center gap-2">
						<Picture className="size-5 text-white/60" />
						<h3 className="font-semibold text-xl">Background Image</h3>
					</div>
					<p className="text-sm text-white/50">
						Used as the background of your rank card. Ideal size is 1600×400 (4:1).
					</p>
				</div>

				{backgroundUrl && (
					<div className="flex gap-2">
						<Button
							className="font-medium"
							isDisabled={isUploading}
							onPress={() => fileInputRef.current?.click()}
							size="sm"
							variant="secondary"
						>
							<ArrowUpFromLine className="size-4" />
							Replace
						</Button>
						<Button isDisabled={isDeleting} onPress={() => setDeleteModalOpen(true)} size="sm" variant="danger">
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
					className={`flex aspect-4/2 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-colors sm:aspect-4/1 ${
						isDragging
							? "border-primary bg-primary/10"
							: "border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5"
					}`}
					disabled={isUploading}
					onClick={() => fileInputRef.current?.click()}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					type="button"
				>
					<div className="flex flex-col items-center gap-2 text-white/40">
						<ArrowUpFromLine className="size-8" />
						<p className="text-sm">{isUploading ? "Uploading..." : "Drag & drop or click to upload"}</p>
						<p className="text-white/25 text-xs">JPEG, PNG, or WebP. Max 5 MB.</p>
					</div>
				</button>
			)}

			{error && <p className="text-red text-sm">{error}</p>}

			<Modal.Backdrop isOpen={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
				<Modal.Container placement="center">
					<Modal.Dialog className="sm:max-w-100">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Heading>Delete Background</Modal.Heading>
						</Modal.Header>
						<Modal.Body>
							<p>Are you sure you want to delete your background image? This cannot be undone.</p>
						</Modal.Body>
						<Modal.Footer>
							<Button onPress={() => setDeleteModalOpen(false)} variant="secondary">
								Cancel
							</Button>
							<Button isDisabled={isDeleting} onPress={handleDelete} variant="danger">
								{isDeleting ? "Deleting..." : "Delete"}
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</div>
	);
}
