"use client";

import { EmbedBuilder } from "@/components/dashboard/embed/EmbedBuilder.tsx";
import { ExpandMore } from "@/components/icons/mdi/expand-more.tsx";
import type { Embed, Emoji, Role } from "@/lib/guild.ts";
import { Disclosure, DisclosureContent, useDisclosureStore, useStoreState } from "@ariakit/react";
import clsx from "clsx";
import { levelUpMessagePlaceholders } from "./level-up-message-placeholders.ts";

export function LevelUpMessageEmbed({ defaultValue, emojis, roles }: LevelUpMessageEmbedProps) {
	const disclosure = useDisclosureStore();
	const open = useStoreState(disclosure, "open");

	return (
		<div className="flex flex-col">
			<Disclosure
				className={clsx(
					"flex max-w-3xl cursor-pointer items-center justify-between gap-1 border border-white/25 bg-dark-gray px-2 py-1.5 hover:bg-dark-gray/50",
					open ? "mb-0 rounded-t-lg" : "mb-4 rounded-lg",
				)}
				store={disclosure}
			>
				Embed
				<ExpandMore className={clsx(clsx("transition ease-in-out", open ? "rotate-180" : "rotate-0"))} />
			</Disclosure>

			<DisclosureContent
				className="flex max-w-3xl flex-col rounded-b-lg border border-white/25 bg-dark-gray px-2 py-1.5"
				store={disclosure}
			>
				<EmbedBuilder
					defaultValue={defaultValue}
					emojis={emojis}
					roles={roles}
					placeholders={levelUpMessagePlaceholders}
				/>
			</DisclosureContent>
		</div>
	);
}

interface LevelUpMessageEmbedProps {
	readonly emojis: Emoji[];
	readonly roles: Role[];
	readonly defaultValue: Embed | null;
}
