import { Button } from "@/components/ui/button.tsx";
import { DatePicker } from "@/components/ui/date-picker.tsx";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { ApiKeyPermission } from "@/lib/guild";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { extractErrorMessage } from "@/utils/extract-error-message.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { RiClipboardLine } from "@remixicon/react";
import Cookies from "js-cookie";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

export function CreateApiKeyDialog({ revalidateApiKeys }: { revalidateApiKeys: () => void }) {
	const [isOpen, setIsOpen] = useState(false);
	const [apiKey, setApiKey] = useState<string | null>(null);

	const presets = [
		{
			label: "Tomorrow",
			date: new Date(new Date().setDate(new Date().getDate() + 1)),
		},
		{
			label: "In a week",
			date: new Date(new Date().setDate(new Date().getDate() + 7)),
		},
		{
			label: "In a month",
			date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
		},
		{
			label: "In 6 months",
			date: new Date(new Date().setMonth(new Date().getMonth() + 6)),
		},
		{
			label: "In a year",
			date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
		},
		{
			label: "In 2 years",
			date: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
		},
		{
			label: "In 5 years",
			date: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
		},
	];

	async function handleCreateApiKey(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const data = new FormData(event.currentTarget);

		const name = data.get("name") as string;
		const permission = data.get("permission") as ApiKeyPermission;
		const expiresAt = (data.get("expiresAt") as string) || undefined;

		const token = Cookies.get(TOKEN_COOKIE)!;

		try {
			const response = await makeApiRequest("/users/@me/keys", token, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, permission, expiresAt }),
			});

			const result = (await response.json()) as CreateApiKeyResult;

			setApiKey(result.key);
		} catch (error) {
			console.error("Failed to create API key", error);
			toast.error(extractErrorMessage(error, "Failed to create API key."));
		}
	}

	function handleCloseDialog(open: boolean) {
		setIsOpen(open);

		if (!open) {
			setApiKey(null);
			revalidateApiKeys();
		}
	}

	async function handleCopyApiKey(key: string) {
		await navigator.clipboard.writeText(key);
		toast.success("Copied to clipboard");
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleCloseDialog}>
			<DialogTrigger asChild>
				<Button>Create API Key</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create API Key</DialogTitle>
					<DialogDescription>
						{apiKey ? (
							<>
								{/* Can't use a <p> here because <DialogDescription> is a <p> */}
								<span>Please, copy your API Key and save it in a secure place.</span>
								<br />
								<span className="font-bold">It will not be shown again.</span>
							</>
						) : (
							"Create a key to access Lurkr's API."
						)}
					</DialogDescription>
				</DialogHeader>

				{apiKey ? (
					<div className="mt-2 space-y-2">
						<div className="flex items-center gap-2">
							<Input id="apiKey" value={apiKey} readOnly />

							<Button className="p-2.5" variant="secondary" onClick={() => handleCopyApiKey(apiKey)}>
								<span className="sr-only">Copy API Key to clipboard</span>
								<RiClipboardLine aria-hidden className="size-4" />
							</Button>
						</div>

						<p className="text-gray-500 text-sm">
							After securing your API Key, you will have to grant it access to the guilds you want to use it in. By
							default, it will not have any access.
						</p>

						<p className="text-gray-500 text-sm">You can do this by using the actions button.</p>

						<DialogFooter className="mt-4">
							<DialogClose asChild>
								<Button type="button" variant="light">
									Close
								</Button>
							</DialogClose>
						</DialogFooter>
					</div>
				) : (
					<form className="mt-2 space-y-2" onSubmit={handleCreateApiKey}>
						<div>
							<Label htmlFor="name" required>
								Name
							</Label>
							<Input id="name" name="name" required placeholder="Enter a name" />
						</div>

						<div>
							<Label htmlFor="permission" required>
								Permission
							</Label>
							<Select name="permission" defaultValue={ApiKeyPermission.Read}>
								<SelectTrigger id="permission">
									<SelectValue placeholder="Select a permission" />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value={ApiKeyPermission.Read}>Read</SelectItem>
									<SelectItem value={ApiKeyPermission.Write}>Write</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label htmlFor="expiresAt">Expiration date</Label>
							<DatePicker presets={presets} name="expiresAt" />
						</div>

						<DialogFooter className="mt-4">
							<DialogClose asChild>
								<Button type="button" variant="light">
									Go back
								</Button>
							</DialogClose>

							{apiKey ? null : <Button type="submit">Create</Button>}
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}

interface CreateApiKeyResult {
	id: string;
	key: string;
}
