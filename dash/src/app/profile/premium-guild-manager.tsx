"use client";

import { Star } from "@gravity-ui/icons";
import { Button, ListBox, Select } from "@heroui/react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useState } from "react";
import { PremiumTier } from "@/lib/auth.ts";
import type { UserGuildInfo } from "@/lib/guild.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { extractErrorMessage } from "@/utils/extract-error-message.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";

interface PremiumGuild {
	id: string;
	icon: string | null;
	name: string;
}

interface PremiumGuildManagerProps {
	readonly guilds: UserGuildInfo[];
	readonly premium: PremiumTier;
	readonly premiumGuild: PremiumGuild | null;
}

export function PremiumGuildManager({ guilds, premium, premiumGuild }: PremiumGuildManagerProps) {
	const [currentGuild, setCurrentGuild] = useState<PremiumGuild | null>(premiumGuild);
	const [selectedGuildId, setSelectedGuildId] = useState<string | null>(premiumGuild?.id ?? null);
	const [isSaving, setIsSaving] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isGuildTier = premium === PremiumTier.Guild;
	const hasChanges = selectedGuildId !== (currentGuild?.id ?? null);

	async function handleSave() {
		if (!selectedGuildId) return;
		setError(null);
		setIsSaving(true);

		try {
			const token = Cookies.get(TOKEN_COOKIE)!;
			const response = await makeApiRequest("/users/@me/premium-guild", token, {
				body: JSON.stringify({ guildId: selectedGuildId }),
				headers: { "Content-Type": "application/json" },
				method: "POST",
			});

			const guild = (await response.json()) as PremiumGuild;
			setCurrentGuild(guild);
		} catch (error) {
			setError(extractErrorMessage(error, "Failed to assign premium guild."));
		} finally {
			setIsSaving(false);
		}
	}

	async function handleRemove() {
		setError(null);
		setIsRemoving(true);

		try {
			const token = Cookies.get(TOKEN_COOKIE)!;
			await makeApiRequest("/users/@me/premium-guild", token, {
				method: "DELETE",
			});

			setCurrentGuild(null);
			setSelectedGuildId(null);
		} catch (error) {
			setError(extractErrorMessage(error, "Failed to remove premium guild."));
		} finally {
			setIsRemoving(false);
		}
	}

	return (
		<div className="space-y-4">
			<div>
				<div className="flex items-center gap-2">
					<Star className="size-5 text-white/60" />
					<h3 className="font-semibold text-xl">Premium Guild</h3>
				</div>
				<p className="text-sm text-white/50">
					Assign your premium benefits to a server for increased configuration limits.
				</p>
			</div>

			{isGuildTier ? (
				<>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<Select
							className="flex-1"
							onSelectionChange={(key) => {
								if (key) {
									setSelectedGuildId(key as string);
									setError(null);
								}
							}}
							placeholder="Select a server"
							selectedKey={selectedGuildId}
						>
							<Select.Trigger>
								<Select.Value />
								<Select.Indicator />
							</Select.Trigger>
							<Select.Popover>
								<ListBox>
									{guilds.map((guild) => (
										<ListBox.Item id={guild.id} key={guild.id} textValue={guild.name}>
											{guild.name}
											<ListBox.ItemIndicator />
										</ListBox.Item>
									))}
								</ListBox>
							</Select.Popover>
						</Select>

						<div className="flex gap-2">
							{hasChanges && selectedGuildId && (
								<Button isDisabled={isSaving} onPress={handleSave} variant="primary">
									{isSaving ? "Saving..." : "Save"}
								</Button>
							)}
							{currentGuild && (
								<Button isDisabled={isRemoving} onPress={handleRemove} variant="danger">
									{isRemoving ? "Removing..." : "Remove"}
								</Button>
							)}
						</div>
					</div>

					{error && <p className="text-red text-sm">{error}</p>}
				</>
			) : (
				<div className="rounded-xl border border-white/10 bg-white/3 px-4 py-3">
					<p className="text-sm text-white/70">
						You need{" "}
						<Link
							className="font-medium text-white underline decoration-white/30 hover:decoration-white/60"
							href="/premium"
						>
							Lurkr Ultimate
						</Link>{" "}
						to assign premium benefits to a server.
					</p>
				</div>
			)}
		</div>
	);
}
