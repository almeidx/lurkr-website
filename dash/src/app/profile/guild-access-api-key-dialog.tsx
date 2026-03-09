"use client";

import { Button, Checkbox, Label, Modal } from "@heroui/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImageWithFallback } from "@/components/ImageWithFallback.tsx";
import { api } from "@/lib/api.ts";
import type { UserGuildInfo } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { guildIcon } from "@/utils/discord-cdn.ts";
import { extractErrorMessage } from "@/utils/extract-error-message.ts";
import type { GetUserApiKeysResult } from "./get-user-api-keys.ts";

export function GuildAccessApiKeyDialog({
	keyId,
	keyName,
	guilds,
	guildAccess,
	open,
	onOpenChange,
	onDirtyClose,
}: GuildAccessApiKeyDialogProps) {
	const dirtyRef = useRef(false);
	const [enabledGuilds, setEnabledGuilds] = useState(() => new Set(guildAccess.map((ga) => ga.guildId)));
	const [pendingGuilds, setPendingGuilds] = useState<Set<Snowflake>>(() => new Set());

	async function handleCheckedChange(guildId: Snowflake, checked: boolean) {
		setPendingGuilds((prev) => new Set(prev).add(guildId));
		setEnabledGuilds((prev) => {
			const next = new Set(prev);
			if (checked) next.add(guildId);
			else next.delete(guildId);
			return next;
		});

		try {
			await api(`users/@me/keys/${keyId}/guilds/${guildId}`, {
				method: checked ? "POST" : "DELETE",
			});
			dirtyRef.current = true;
		} catch (error) {
			setEnabledGuilds((prev) => {
				const next = new Set(prev);
				if (checked) next.delete(guildId);
				else next.add(guildId);
				return next;
			});
			toast.error(extractErrorMessage(error, "Failed to update guild access"));
		} finally {
			setPendingGuilds((prev) => {
				const next = new Set(prev);
				next.delete(guildId);
				return next;
			});
		}
	}

	function handleClose(isOpen: boolean) {
		if (!isOpen && dirtyRef.current) onDirtyClose();
		onOpenChange(isOpen);
	}

	return (
		<Modal>
			<Modal.Backdrop isOpen={open} onOpenChange={handleClose}>
				<Modal.Container placement="center">
					<Modal.Dialog className="sm:max-w-lg">
						<Modal.CloseTrigger />
						<Modal.Header>
							<Modal.Heading>Edit {keyName} Guild Access</Modal.Heading>
							<p className="text-sm text-white/60">Toggle the guilds this API key can access.</p>
						</Modal.Header>
						<Modal.Body>
							<div className="flex max-h-96 flex-col gap-1 overflow-y-auto px-1">
								{guilds.map((guild) => {
									const isPending = pendingGuilds.has(guild.id);
									const isChecked = enabledGuilds.has(guild.id);
									const iconUrl = guildIcon(guild.id, guild.icon, { size: 64 });

									return (
										<Checkbox
											isDisabled={isPending}
											isSelected={isChecked}
											key={guild.id}
											onChange={(checked) => handleCheckedChange(guild.id, checked)}
										>
											<Checkbox.Control>
												<Checkbox.Indicator />
											</Checkbox.Control>
											<Checkbox.Content>
												<Label className="flex items-center gap-2">
													{iconUrl ? (
														<ImageWithFallback
															alt=""
															className="size-6 rounded-full"
															height={24}
															src={iconUrl}
															unoptimized
															width={24}
														/>
													) : (
														<span className="flex size-6 items-center justify-center rounded-full bg-white/10 font-medium text-[10px]">
															{guild.name.charAt(0)}
														</span>
													)}
													<span className="truncate">{guild.name}</span>
												</Label>
											</Checkbox.Content>
										</Checkbox>
									);
								})}
							</div>
						</Modal.Body>
						<Modal.Footer>
							<Button onPress={() => handleClose(false)} variant="secondary">
								Done
							</Button>
						</Modal.Footer>
					</Modal.Dialog>
				</Modal.Container>
			</Modal.Backdrop>
		</Modal>
	);
}

interface GuildAccessApiKeyDialogProps {
	keyId: string;
	keyName: string;
	guilds: UserGuildInfo[];
	guildAccess: GetUserApiKeysResult["keys"][number]["guildAccess"];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDirtyClose: () => void;
}
