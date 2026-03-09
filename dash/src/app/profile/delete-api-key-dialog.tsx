"use client";

import { Button, Modal } from "@heroui/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api.ts";
import { extractErrorMessage } from "@/utils/extract-error-message.ts";

export function DeleteApiKeyDialog({ keyId, keyName, open, onOpenChange, onDeleted }: DeleteApiKeyDialogProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		setIsDeleting(true);

		try {
			await api.delete(`users/@me/keys/${keyId}`);
			onDeleted();
			onOpenChange(false);
		} catch (error) {
			toast.error(extractErrorMessage(error, "Failed to delete API key."));
			setIsDeleting(false);
		}
	}

	return (
		<Modal>
			<Modal.Backdrop isOpen={open} onOpenChange={onOpenChange}>
				<Modal.Container placement="center">
					<Modal.Dialog className="sm:max-w-100">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Heading>Delete API Key</Modal.Heading>
							<p className="text-sm text-white/60">
								Are you sure you want to delete the API key <b>{keyName}</b>? This action cannot be undone.
							</p>
						</Modal.Header>
						<Modal.Footer>
							<Button onPress={() => onOpenChange(false)} variant="secondary">
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

interface DeleteApiKeyDialogProps {
	keyId: string;
	keyName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDeleted: () => void;
}
