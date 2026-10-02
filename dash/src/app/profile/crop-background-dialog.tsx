"use client";

import "react-image-crop/dist/ReactCrop.css";
import { Button, Modal } from "@heroui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, { centerCrop, type Crop, makeAspectCrop, type PixelCrop } from "react-image-crop";

const ASPECT_RATIO = 4;

export function CropBackgroundDialog({ file, onConfirm, onClose }: CropBackgroundDialogProps) {
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const [isBusy, setIsBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const imgRef = useRef<HTMLImageElement>(null);

	const imageSrc = URL.createObjectURL(file);

	useEffect(() => {
		return () => URL.revokeObjectURL(imageSrc);
	}, [imageSrc]);

	const onImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
		const { width, height } = event.currentTarget;
		setCrop(centerCrop(makeAspectCrop({ unit: "%", width: 100 }, ASPECT_RATIO, width, height), width, height));
	}, []);

	async function handleConfirm() {
		if (!imgRef.current || !completedCrop) return;

		setIsBusy(true);
		setError(null);

		try {
			const blob = await getCroppedBlob(imgRef.current, completedCrop, file.type);
			await onConfirm(new File([blob], file.name, { type: file.type }));
		} catch {
			setError("Failed to upload background.");
		}
		setIsBusy(false);
	}

	return (
		<Modal>
			<Modal.Backdrop isOpen onOpenChange={(open) => !open && onClose()}>
				<Modal.Container placement="center">
					<Modal.Dialog className="sm:max-w-2xl">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Heading>Crop Background</Modal.Heading>
							<p className="text-sm text-white/50">
								Drag to reposition the crop area. The image will be cropped to a 4:1 aspect ratio.
							</p>
						</Modal.Header>
						<Modal.Body className="overflow-hidden">
							{imageSrc && (
								<ReactCrop
									aspect={ASPECT_RATIO}
									className="max-w-full [&_img]:max-w-full"
									crop={crop}
									keepSelection
									onChange={(c) => setCrop(c)}
									onComplete={(c) => setCompletedCrop(c)}
								>
									{/* oxlint-disable-next-line nextjs/no-img-element -- crop preview managed by react-image-crop via ref; next/image is unsuitable */}
									<img alt="Crop preview" className="max-h-[60vh]" onLoad={onImageLoad} ref={imgRef} src={imageSrc} />
								</ReactCrop>
							)}
							{error && <p className="mt-2 text-sm text-red">{error}</p>}
						</Modal.Body>
						<Modal.Footer>
							<Button onPress={onClose} variant="secondary">
								Cancel
							</Button>
							<Button isDisabled={isBusy || !completedCrop} onPress={handleConfirm} variant="primary">
								{isBusy ? "Uploading..." : "Crop & Upload"}
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

async function getCroppedBlob(image: HTMLImageElement, crop: PixelCrop, mimeType: string): Promise<Blob> {
	const canvas = document.createElement("canvas");
	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;

	canvas.width = Math.round(crop.width * scaleX);
	canvas.height = Math.round(crop.height * scaleY);

	const ctx = canvas.getContext("2d")!;
	ctx.drawImage(
		image,
		Math.round(crop.x * scaleX),
		Math.round(crop.y * scaleY),
		canvas.width,
		canvas.height,
		0,
		0,
		canvas.width,
		canvas.height,
	);

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) resolve(blob);
				else reject(new Error("Failed to create cropped image."));
			},
			mimeType,
			0.92,
		);
	});
}

interface CropBackgroundDialogProps {
	readonly file: File;
	readonly onConfirm: (croppedFile: File) => Promise<void>;
	readonly onClose: () => void;
}
