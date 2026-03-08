"use client";

import { Copy } from "@gravity-ui/icons";
import { Button, Input, Label, ListBox, Modal, Select, TextField } from "@heroui/react";
import { addDays } from "date-fns";
import { type SubmitEvent, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api.ts";
import { ApiKeyPermission } from "@/lib/guild.ts";
import { extractErrorMessage } from "@/utils/extract-error-message.ts";

const EXPIRATION_OPTIONS = [
	{ days: 7, id: "7d", label: "7 days" },
	{ days: 30, id: "30d", label: "30 days" },
	{ days: 90, id: "90d", label: "90 days" },
	{ days: 365, id: "1y", label: "1 year" },
	{ days: undefined, id: "never", label: "Never" },
] as const;

export function CreateApiKeyDialog({ revalidateApiKeys }: { revalidateApiKeys: () => void }) {
	const [isOpen, setIsOpen] = useState(false);
	const [apiKey, setApiKey] = useState<string | null>(null);
	const [permission, setPermission] = useState<ApiKeyPermission>(ApiKeyPermission.Read);
	const [expiration, setExpiration] = useState<string>("never");

	async function handleCreateApiKey(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const name = data.get("name") as string;
		const days = EXPIRATION_OPTIONS.find((o) => o.id === expiration)?.days;
		const expiresAt = days ? addDays(new Date(), days).toISOString() : undefined;

		try {
			const result = await api
				.post("users/@me/keys", {
					json: { expiresAt, name, permission },
				})
				.json<CreateApiKeyResult>();
			setApiKey(result.key);
		} catch (error) {
			console.error("Failed to create API key", error);
			toast.error(extractErrorMessage(error, "Failed to create API key."));
		}
	}

	function handleCloseDialog(open: boolean) {
		setIsOpen(open);
		if (!open) {
			const didCreate = apiKey !== null;
			setApiKey(null);
			setPermission(ApiKeyPermission.Read);
			setExpiration("never");
			if (didCreate) revalidateApiKeys();
		}
	}

	async function handleCopyApiKey(key: string) {
		await navigator.clipboard.writeText(key);
		toast.success("Copied to clipboard");
	}

	return (
		<>
			<Button onPress={() => setIsOpen(true)} size="sm" variant="primary">
				Create API Key
			</Button>

			<Modal.Backdrop isOpen={isOpen} onOpenChange={handleCloseDialog}>
				<Modal.Container placement="center">
					<Modal.Dialog className="sm:max-w-md">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Heading>Create API Key</Modal.Heading>
							<p className="text-sm text-white/60">
								{apiKey
									? "Copy your API Key and save it securely. It will not be shown again."
									: "Create a key to access Lurkr's API."}
							</p>
						</Modal.Header>

						{apiKey ? (
							<>
								<Modal.Body className="pt-4">
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<input
												className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm"
												readOnly
												value={apiKey}
											/>
											<Button
												aria-label="Copy API Key to clipboard"
												onPress={() => handleCopyApiKey(apiKey)}
												variant="secondary"
											>
												<Copy className="size-4" />
											</Button>
										</div>

										<p className="text-sm text-white/50">
											After securing your API Key, grant it access to guilds using the actions menu.
										</p>
									</div>
								</Modal.Body>
								<Modal.Footer>
									<Button onPress={() => handleCloseDialog(false)} variant="secondary">
										Close
									</Button>
								</Modal.Footer>
							</>
						) : (
							<form onSubmit={handleCreateApiKey}>
								<Modal.Body className="overflow-visible pt-4">
									<div className="space-y-4">
										<TextField isRequired name="name">
											<Label>Name</Label>
											<Input placeholder="Enter a name" />
										</TextField>

										<Select
											className="w-full"
											onSelectionChange={(key) => {
												if (key) setPermission(key as ApiKeyPermission);
											}}
											placeholder="Select permission"
											selectedKey={permission}
										>
											<Label>Permission</Label>
											<Select.Trigger>
												<Select.Value />
												<Select.Indicator />
											</Select.Trigger>
											<Select.Popover>
												<ListBox>
													<ListBox.Item id={ApiKeyPermission.Read} textValue="Read">
														Read
														<ListBox.ItemIndicator />
													</ListBox.Item>
													<ListBox.Item id={ApiKeyPermission.Write} textValue="Read/Write">
														Read/Write
														<ListBox.ItemIndicator />
													</ListBox.Item>
												</ListBox>
											</Select.Popover>
										</Select>

										<Select
											className="w-full"
											onSelectionChange={(key) => {
												if (key) setExpiration(key as string);
											}}
											selectedKey={expiration}
										>
											<Label>Expiration</Label>
											<Select.Trigger>
												<Select.Value />
												<Select.Indicator />
											</Select.Trigger>
											<Select.Popover>
												<ListBox>
													{EXPIRATION_OPTIONS.map((option) => (
														<ListBox.Item id={option.id} key={option.id} textValue={option.label}>
															{option.label}
															<ListBox.ItemIndicator />
														</ListBox.Item>
													))}
												</ListBox>
											</Select.Popover>
										</Select>
									</div>
								</Modal.Body>
								<Modal.Footer>
									<Button onPress={() => handleCloseDialog(false)} variant="secondary">
										Cancel
									</Button>
									<Button type="submit" variant="primary">
										Create
									</Button>
								</Modal.Footer>
							</form>
						)}
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</>
	);
}

interface CreateApiKeyResult {
	id: string;
	key: string;
}
