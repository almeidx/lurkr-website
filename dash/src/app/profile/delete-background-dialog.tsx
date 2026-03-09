"use client";

import { Button, Modal } from "@heroui/react";
import { useState } from "react";
import { toast } from "sonner";
import { extractErrorMessage } from "@/utils/extract-error-message.ts";

export function DeleteBackgroundDialog({ onConfirm, onClose }: DeleteBackgroundDialogProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		setIsDeleting(true);

		try {
			await onConfirm();
		} catch (error) {
			toast.error(extractErrorMessage(error, "Failed to delete background."));
			setIsDeleting(false);
		}
	}

	return (
		<Modal>
			<Modal.Backdrop isOpen onOpenChange={(open) => !open && onClose()}>
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
							<Button onPress={onClose} variant="secondary">
								Cancel
							</Button>
							<Button isDisabled={isDeleting} onPress={handleDelete} variant="danger">
								{isDeleting ? "Deleting..." : "Delete"}
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

interface DeleteBackgroundDialogProps {
	readonly onConfirm: () => Promise<void>;
	readonly onClose: () => void;
}
