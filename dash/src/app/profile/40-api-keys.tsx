"use client";

import { Key } from "@gravity-ui/icons";
import { Chip, Spinner, Table } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api.ts";
import { ApiKeyPermission, type UserGuildInfo } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { CreateApiKeyDialog } from "./create-api-key-dialog.tsx";
import { DeleteApiKeyDialog } from "./delete-api-key-dialog.tsx";
import { GuildAccessApiKeyDialog } from "./guild-access-api-key-dialog.tsx";
import { TableRowActions } from "./table-row-actions.tsx";

const MAX_API_KEYS = 5;

export function ApiKeys({ guilds }: ApiKeysProps) {
	const [keys, setKeys] = useState<GetUserApiKeysResult["keys"]>([]);
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	const [focusedKeyId, setFocusedKeyId] = useState<string | null>(null);
	const [openDialog, setOpenDialog] = useState<"guild-access" | "delete" | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only want to run this once on mount
	useEffect(() => {
		fetchKeys();
	}, []);

	function fetchKeys() {
		getUserApiKeys()
			.then((keys) => setKeys(keys))
			.finally(() => setIsInitialLoad(false));
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
					<Link className="text-primary hover:underline" href="/docs/api">
						here
					</Link>
					.
				</p>
			</div>

			{isInitialLoad ? (
				<div className="flex justify-center py-4">
					<Spinner />
				</div>
			) : (
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
											{new Date(item.createdAt).toLocaleDateString()}
										</Table.Cell>
										<Table.Cell className="hidden md:table-cell">
											{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "Never"}
										</Table.Cell>
										<Table.Cell className="hidden sm:table-cell">
											{item.lastUsedAt ? new Date(item.lastUsedAt).toLocaleDateString() : "Never"}
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
			)}

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

async function getUserApiKeys() {
	try {
		const { keys } = await api.get("users/@me/keys").json<GetUserApiKeysResult>();
		return keys;
	} catch {
		return [];
	}
}

interface ApiKeysProps {
	guilds: UserGuildInfo[];
}

export interface GetUserApiKeysResult {
	keys: {
		id: string;
		name: string;
		createdAt: string;
		expiresAt: string | null;
		permission: ApiKeyPermission;
		lastUsedAt: string | null;
		guildAccess: {
			createdAt: string;
			guildId: Snowflake;
		}[];
	}[];
}
