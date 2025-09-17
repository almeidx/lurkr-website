import Cookies from "js-cookie";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { UserGuildInfo } from "@/lib/guild.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { extractErrorMessage } from "@/utils/extract-error-message.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import type { GetUserApiKeysResult } from "./api-keys.tsx";

export function GuildAccessApiKeyDialog({
	keyId,
	keyName,
	guilds,
	guildAccess,
	open,
	onOpenChange,
}: GuildAccessApiKeyDialogProps) {
	const token = Cookies.get(TOKEN_COOKIE)!;

	async function handleAddGuildAccess(guildId: Snowflake) {
		if (!guilds.some((guild) => guild.id === guildId)) {
			console.debug("[handleAddGuildAccess] Guild not found", guildId);
			return;
		}

		await makeApiRequest(`/users/@me/keys/${keyId}/guilds/${guildId}`, token, { method: "POST" });
	}

	async function handleRemoveGuildAccess(guildId: Snowflake) {
		if (!guilds.some((guild) => guild.id === guildId)) {
			console.debug("[handleRemoveGuildAccess] Guild not found", guildId);
			return;
		}

		await makeApiRequest(`/users/@me/keys/${keyId}/guilds/${guildId}`, token, { method: "DELETE" });
	}

	async function handleCheckedChange(guildId: Snowflake, checked: boolean) {
		try {
			if (checked) {
				await handleAddGuildAccess(guildId);
			} else {
				await handleRemoveGuildAccess(guildId);
			}
		} catch (error) {
			toast.error(extractErrorMessage(error, "Failed to update guild access"));
		}
	}

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Edit {keyName} Guild Access</DialogTitle>
					<DialogDescription className="mt-1 text-sm leading-6">
						Change the guilds that this API key has access to.
					</DialogDescription>
				</DialogHeader>

				<div className="mt-2 flex max-h-96 flex-col gap-2 overflow-y-auto">
					{guilds.map((guild) => (
						<div className="flex items-center gap-2" key={guild.id}>
							<Checkbox
								defaultChecked={guildAccess.some((guildAccess) => guildAccess.guildId === guild.id)}
								id={`guild-${guild.id}`}
								name={`guild-${guild.id}`}
								onCheckedChange={(checked) =>
									handleCheckedChange(guild.id, typeof checked === "boolean" ? checked : false)
								}
							/>

							<Label className="truncate text-nowrap" htmlFor={`guild-${guild.id}`} title={guild.name}>
								{guild.name}
							</Label>
						</div>
					))}
				</div>

				<DialogFooter className="mt-6">
					<DialogClose asChild>
						<Button className="mt-2 w-full sm:mt-0 sm:w-fit" variant="secondary">
							Go back
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface GuildAccessApiKeyDialogProps {
	keyId: string;
	keyName: string;

	guilds: UserGuildInfo[];
	guildAccess: GetUserApiKeysResult["keys"][number]["guildAccess"];

	open: boolean;
	onOpenChange: (open: boolean) => void;
}
