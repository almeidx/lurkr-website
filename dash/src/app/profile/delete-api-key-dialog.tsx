import Cookies from "js-cookie";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog.tsx";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { extractErrorMessage } from "@/utils/extract-error-message.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

export function DeleteApiKeyDialog({ keyId, keyName, open, onOpenChange }: DeleteApiKeyDialogProps) {
	const token = Cookies.get(TOKEN_COOKIE)!;

	async function handleDelete() {
		try {
			await makeApiRequest(`/users/@me/keys/${keyId}`, token, { method: "DELETE" });
			onOpenChange(false);
		} catch (error) {
			toast.error(extractErrorMessage(error, "Failed to delete API key."));
		}
	}

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete API Key</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete the API key <b>{keyName}</b>? This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="mt-4 flex flex-row gap-2">
					<DialogClose asChild>
						<Button variant="secondary">Cancel</Button>
					</DialogClose>
					<Button onClick={handleDelete} variant="destructive">
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface DeleteApiKeyDialogProps {
	keyId: string;
	keyName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}
