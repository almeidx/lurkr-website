"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Text } from "@/components/dashboard/Text.tsx";
import { LoadingSpinner } from "@/components/LoadingSpinner.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table.tsx";
import { ApiKeyPermission, type UserGuildInfo } from "@/lib/guild.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { CreateApiKeyDialog } from "./create-api-key-dialog.tsx";
import { DeleteApiKeyDialog } from "./delete-api-key-dialog.tsx";
import { GuildAccessApiKeyDialog } from "./guild-access-api-key-dialog.tsx";
import { TableRowActions } from "./table-row-actions.tsx";

const MAX_API_KEYS = 5;

export function ApiKeys({ guilds }: ApiKeysProps) {
	const [keys, setKeys] = useState<GetUserApiKeysResult["keys"]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [guildAccessDialogOpen, setGuildAccessDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [focusedApiKeyIndex, setFocusedApiKeyIndex] = useState<number | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only want to run this once on mount
	useEffect(() => {
		revalidateApiKeys();
	}, []);

	function revalidateApiKeys() {
		const token = Cookies.get(TOKEN_COOKIE)!;

		setIsLoading(true);
		getUserApiKeys(token)
			.then((keys) => setKeys(keys))
			.finally(() => setIsLoading(false));
	}

	function handleOpenDeleteApiKeyDialog(index: number) {
		setFocusedApiKeyIndex(index);
		setDeleteDialogOpen(true);
	}

	function handleCloseDeleteApiKeyDialog(open: boolean) {
		setDeleteDialogOpen(open);

		if (!open) {
			setFocusedApiKeyIndex(null);
			revalidateApiKeys();
		}
	}

	function handleOpenGuildAccessDialog(index: number) {
		setFocusedApiKeyIndex(index);
		setGuildAccessDialogOpen(true);
	}

	function handleCloseGuildAccessDialog(open: boolean) {
		setGuildAccessDialogOpen(open);

		if (!open) {
			setFocusedApiKeyIndex(null);
			revalidateApiKeys();
		}
	}

	return (
		<>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="font-semibold text-xl">API Keys</h3>

					{keys.length < MAX_API_KEYS ? <CreateApiKeyDialog revalidateApiKeys={revalidateApiKeys} /> : null}
				</div>

				<Text>
					Overview of all registered API keys. Learn more about the API{" "}
					<Link className="text-primary" href="/docs/api">
						here
					</Link>
					.
				</Text>
			</div>

			{isLoading ? (
				<LoadingSpinner />
			) : keys.length > 0 ? (
				<>
					<div className="overflow-x-auto">
						<div className="min-w-80">
							<Table className="mt-4 bg-darker">
								<TableHead>
									<TableRow className="border-tremor-border border-b dark:border-dark-tremor-border">
										<TableHeaderCell>Name</TableHeaderCell>
										<TableHeaderCell>Permission</TableHeaderCell>
										<TableHeaderCell>Guilds</TableHeaderCell>
										<TableHeaderCell className="hidden md:table-cell">Created At</TableHeaderCell>
										<TableHeaderCell className="hidden md:table-cell">Expires At</TableHeaderCell>
										<TableHeaderCell className="hidden sm:table-cell">Last Used</TableHeaderCell>
										<TableHeaderCell className="text-right">Actions</TableHeaderCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{keys.map((item, index) => (
										<TableRow key={item.id}>
											<TableCell className="font-medium">{item.name}</TableCell>
											<TableCell>
												<Badge variant={item.permission === ApiKeyPermission.Read ? "success" : "warning"}>
													{item.permission === ApiKeyPermission.Read ? "Read" : "Read/Write"}
												</Badge>
											</TableCell>
											<TableCell>{item.guildAccess.length}</TableCell>
											<TableCell className="hidden md:table-cell">
												{new Date(item.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell className="hidden md:table-cell">
												{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "Never"}
											</TableCell>
											<TableCell className="hidden sm:table-cell">
												{item.lastUsedAt ? new Date(item.lastUsedAt).toLocaleDateString() : "Never"}
											</TableCell>
											<TableCell className="text-right">
												<TableRowActions
													openDeleteDialog={() => handleOpenDeleteApiKeyDialog(index)}
													openGuildAccessDialog={() => handleOpenGuildAccessDialog(index)}
												/>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>

					{focusedApiKeyIndex !== null && keys[focusedApiKeyIndex] && (
						<GuildAccessApiKeyDialog
							guildAccess={keys[focusedApiKeyIndex].guildAccess}
							guilds={guilds}
							keyId={keys[focusedApiKeyIndex].id}
							keyName={keys[focusedApiKeyIndex].name}
							onOpenChange={handleCloseGuildAccessDialog}
							open={guildAccessDialogOpen}
						/>
					)}

					{deleteDialogOpen && focusedApiKeyIndex !== null && keys[focusedApiKeyIndex] && (
						<DeleteApiKeyDialog
							keyId={keys[focusedApiKeyIndex].id}
							keyName={keys[focusedApiKeyIndex].name}
							onOpenChange={handleCloseDeleteApiKeyDialog}
							open={deleteDialogOpen}
						/>
					)}
				</>
			) : null}
		</>
	);
}

async function getUserApiKeys(token: string) {
	const response = await makeApiRequest("/users/@me/keys", token);
	if (!response.ok) {
		return [];
	}

	const { keys } = (await response.json()) as GetUserApiKeysResult;
	return keys;
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
