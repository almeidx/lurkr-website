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

	const [guildAccessDialogOpen, setGuildAccessDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [focusedApiKeyIndex, setFocusedApiKeyIndex] = useState<number | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only want to run this once on mount
	useEffect(() => {
		fetchKeys();
	}, []);

	function fetchKeys() {
		getUserApiKeys()
			.then((keys) => setKeys(keys))
			.finally(() => setIsInitialLoad(false));
	}

	function handleOpenDeleteApiKeyDialog(index: number) {
		setFocusedApiKeyIndex(index);
		setDeleteDialogOpen(true);
	}

	function handleCloseDeleteApiKeyDialog(open: boolean) {
		setDeleteDialogOpen(open);
		if (!open) setFocusedApiKeyIndex(null);
	}

	function handleOpenGuildAccessDialog(index: number) {
		setFocusedApiKeyIndex(index);
		setGuildAccessDialogOpen(true);
	}

	function handleCloseGuildAccessDialog(open: boolean) {
		setGuildAccessDialogOpen(open);
		if (!open) setFocusedApiKeyIndex(null);
	}

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
							{keys.map((item, index) => (
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
											openDeleteDialog={() => handleOpenDeleteApiKeyDialog(index)}
											openGuildAccessDialog={() => handleOpenGuildAccessDialog(index)}
										/>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Content>
				</Table.ScrollContainer>
			</Table>

			{isInitialLoad ? (
				<div className="flex justify-center py-4">
					<Spinner />
				</div>
			) : keys.length > 0 ? (
				<>
					{focusedApiKeyIndex !== null && keys[focusedApiKeyIndex] && (
						<GuildAccessApiKeyDialog
							guildAccess={keys[focusedApiKeyIndex].guildAccess}
							guilds={guilds}
							keyId={keys[focusedApiKeyIndex].id}
							keyName={keys[focusedApiKeyIndex].name}
							onDirtyClose={fetchKeys}
							onOpenChange={handleCloseGuildAccessDialog}
							open={guildAccessDialogOpen}
						/>
					)}

					{deleteDialogOpen && focusedApiKeyIndex !== null && keys[focusedApiKeyIndex] && (
						<DeleteApiKeyDialog
							keyId={keys[focusedApiKeyIndex].id}
							keyName={keys[focusedApiKeyIndex].name}
							onDeleted={fetchKeys}
							onOpenChange={handleCloseDeleteApiKeyDialog}
							open={deleteDialogOpen}
						/>
					)}
				</>
			) : null}
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
