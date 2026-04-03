"use client";

import { Key } from "@gravity-ui/icons";
import { Chip, Table } from "@heroui/react";
import { linkVariants } from "@heroui/styles";
import Link from "next/link";
import { useState } from "react";
import { ApiKeyPermission, type UserGuildInfo } from "@/lib/guild.ts";
import { CreateApiKeyDialog } from "./create-api-key-dialog.tsx";
import { DeleteApiKeyDialog } from "./delete-api-key-dialog.tsx";
import { type GetUserApiKeysResult, getUserApiKeys } from "./get-user-api-keys.ts";
import { GuildAccessApiKeyDialog } from "./guild-access-api-key-dialog.tsx";
import { TableRowActions } from "./table-row-actions.tsx";

const MAX_API_KEYS = 5;
const linkClasses = linkVariants().base();

export function ApiKeys({ guilds, initialKeys }: ApiKeysProps) {
	const [keys, setKeys] = useState<GetUserApiKeysResult["keys"]>(initialKeys);

	const [focusedKeyId, setFocusedKeyId] = useState<string | null>(null);
	const [openDialog, setOpenDialog] = useState<"guild-access" | "delete" | null>(null);

	function fetchKeys() {
		getUserApiKeys().then((keys) => setKeys(keys));
	}

	function handleOpenDialog(keyId: string, dialog: "guild-access" | "delete") {
		setFocusedKeyId(keyId);
		setOpenDialog(dialog);
	}

	function handleCloseDialog(open: boolean) {
		if (!open) {
			setOpenDialog(null);
			setFocusedKeyId(null);
		}
	}

	const focusedKey = keys.find((key) => key.id === focusedKeyId);

	return (
		<>
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Key className="size-5 text-white/60" />
						<h3 className="font-semibold text-xl">API Keys</h3>
					</div>
					{keys.length < MAX_API_KEYS ? <CreateApiKeyDialog revalidateApiKeys={fetchKeys} /> : null}
				</div>

				<p className="text-sm text-white/50">
					Overview of all registered API keys. Learn more about the API{" "}
					<Link className={linkClasses} href="/docs/api">
						here
					</Link>
					.
				</p>
			</div>

			<Table>
				<Table.ScrollContainer>
					<Table.Content aria-label="API Keys">
						<Table.Header>
							<Table.Column isRowHeader>Name</Table.Column>
							<Table.Column>Permission</Table.Column>
							<Table.Column className="xs:table-cell hidden">Guilds</Table.Column>
							<Table.Column className="hidden md:table-cell">Created</Table.Column>
							<Table.Column className="hidden md:table-cell">Expires</Table.Column>
							<Table.Column className="hidden sm:table-cell">Last Used</Table.Column>
							<Table.Column className="text-right">Actions</Table.Column>
						</Table.Header>
						<Table.Body>
							{keys.map((item) => (
								<Table.Row key={item.id}>
									<Table.Cell className="font-medium">{item.name}</Table.Cell>
									<Table.Cell>
										<Chip
											className={
												item.permission === ApiKeyPermission.Read
													? "bg-green/20 text-green"
													: "bg-yellow/20 text-yellow"
											}
											size="sm"
										>
											{item.permission === ApiKeyPermission.Read ? "Read" : "Read/Write"}
										</Chip>
									</Table.Cell>
									<Table.Cell className="xs:table-cell hidden">{item.guildAccess.length}</Table.Cell>
									<Table.Cell className="hidden md:table-cell">
										<span suppressHydrationWarning>{new Date(item.createdAt).toLocaleDateString()}</span>
									</Table.Cell>
									<Table.Cell className="hidden md:table-cell">
										<span suppressHydrationWarning>
											{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "Never"}
										</span>
									</Table.Cell>
									<Table.Cell className="hidden sm:table-cell">
										<span suppressHydrationWarning>
											{item.lastUsedAt ? new Date(item.lastUsedAt).toLocaleDateString() : "Never"}
										</span>
									</Table.Cell>
									<Table.Cell className="text-right">
										<TableRowActions
											openDeleteDialog={() => handleOpenDialog(item.id, "delete")}
											openGuildAccessDialog={() => handleOpenDialog(item.id, "guild-access")}
										/>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Content>
				</Table.ScrollContainer>
			</Table>

			{focusedKey && openDialog === "guild-access" && (
				<GuildAccessApiKeyDialog
					guildAccess={focusedKey.guildAccess}
					guilds={guilds}
					keyId={focusedKey.id}
					keyName={focusedKey.name}
					onDirtyClose={fetchKeys}
					onOpenChange={handleCloseDialog}
					open
				/>
			)}

			{focusedKey && openDialog === "delete" && (
				<DeleteApiKeyDialog
					keyId={focusedKey.id}
					keyName={focusedKey.name}
					onDeleted={fetchKeys}
					onOpenChange={handleCloseDialog}
					open
				/>
			)}
		</>
	);
}

interface ApiKeysProps {
	guilds: UserGuildInfo[];
	initialKeys: GetUserApiKeysResult["keys"];
}
