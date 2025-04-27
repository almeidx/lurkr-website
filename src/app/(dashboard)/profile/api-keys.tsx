"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner.tsx";
import { Text } from "@/components/dashboard/Text.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table.tsx";
import { ApiKeyPermission, type UserGuildInfo } from "@/lib/guild.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { CreateApiKeyDialog } from "./create-api-key-dialog.tsx";
import { DeleteApiKeyDialog } from "./delete-api-key-dialog.tsx";
import { GuildAccessApiKeyDialog } from "./guild-access-api-key-dialog.tsx";
import { TableRowActions } from "./table-row-actions.tsx";

export function ApiKeys({ guilds }: ApiKeysProps) {
	const [data, setData] = useState<GetUserApiKeysResult["keys"]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [guildAccessDialogOpen, setGuildAccessDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [focusedApiKeyIndex, setFocusedApiKeyIndex] = useState<number | null>(null);

	useEffect(() => {
		revalidateApiKeys();
	}, []);

	function revalidateApiKeys() {
		const token = Cookies.get(TOKEN_COOKIE)!;

		setIsLoading(true);
		getUserApiKeys(token)
			.then((keys) => setData(keys))
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
			<div className="sm:flex sm:items-center sm:justify-between sm:space-x-10">
				<div className="space-y-4">
					<h3 className="font-semibold text-xl">API Keys</h3>

					<Text>Overview of all registered API keys.</Text>
				</div>

				<CreateApiKeyDialog revalidateApiKeys={revalidateApiKeys} />
			</div>

			{isLoading ? (
				<LoadingSpinner />
			) : data.length > 0 ? (
				<>
					<Table className="mt-4 bg-darker">
						<TableHead>
							<TableRow className="border-tremor-border border-b dark:border-dark-tremor-border">
								<TableHeaderCell>Name</TableHeaderCell>
								<TableHeaderCell>Permission</TableHeaderCell>
								<TableHeaderCell>Guilds</TableHeaderCell>
								<TableHeaderCell>Created At</TableHeaderCell>
								<TableHeaderCell>Expires At</TableHeaderCell>
								<TableHeaderCell>Last Used</TableHeaderCell>
								<TableHeaderCell className="text-right">Actions</TableHeaderCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{data.map((item, index) => (
								<TableRow key={item.id}>
									<TableCell className="font-medium">{item.name}</TableCell>
									<TableCell>
										<Badge variant={item.permission === ApiKeyPermission.Read ? "success" : "warning"}>
											{item.permission}
										</Badge>
									</TableCell>
									<TableCell>{item.guildAccess.length}</TableCell>
									<TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
									<TableCell>{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "Never"}</TableCell>
									<TableCell>{item.lastUsedAt ? new Date(item.lastUsedAt).toLocaleDateString() : "Never"}</TableCell>
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

					{focusedApiKeyIndex !== null && data[focusedApiKeyIndex] && (
						<GuildAccessApiKeyDialog
							keyId={data[focusedApiKeyIndex].id}
							keyName={data[focusedApiKeyIndex].name}
							guildAccess={data[focusedApiKeyIndex].guildAccess}
							guilds={guilds}
							open={guildAccessDialogOpen}
							onOpenChange={handleCloseGuildAccessDialog}
						/>
					)}

					{deleteDialogOpen && focusedApiKeyIndex !== null && data[focusedApiKeyIndex] && (
						<DeleteApiKeyDialog
							keyId={data[focusedApiKeyIndex].id}
							keyName={data[focusedApiKeyIndex].name}
							open={deleteDialogOpen}
							onOpenChange={handleCloseDeleteApiKeyDialog}
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
