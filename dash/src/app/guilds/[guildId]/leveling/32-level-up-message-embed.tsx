import { Disclosure } from "@heroui/react";
import dynamic from "next/dynamic";
import { ExpandMore } from "@/components/icons/mdi/expand-more.tsx";
import type { Embed, Emoji, Role } from "@/lib/guild.ts";
import { levelUpMessagePlaceholders } from "./level-up-message-placeholders.ts";

const EmbedBuilder = dynamic(async () =>
	import("@/components/dashboard/embed/EmbedBuilder.tsx").then((mod) => ({ default: mod.EmbedBuilder })),
);

export function LevelUpMessageEmbed({ defaultValue, emojis, roles }: LevelUpMessageEmbedProps) {
	return (
		<Disclosure className="flex flex-col">
			<Disclosure.Trigger className="group flex max-w-3xl items-center justify-between gap-1 rounded-lg border border-white/25 bg-dark-gray px-2 py-1.5 hover:bg-dark-gray/50 aria-expanded:mb-0 aria-expanded:rounded-t-lg aria-expanded:rounded-b-none">
				Embed
				<ExpandMore className="transition ease-in-out group-aria-expanded:rotate-180" />
			</Disclosure.Trigger>

			<Disclosure.Content className="max-w-3xl">
				<div className="flex flex-col rounded-b-lg border border-white/25 bg-dark-gray px-2 py-1.5">
					<EmbedBuilder
						defaultValue={defaultValue}
						emojis={emojis}
						placeholders={levelUpMessagePlaceholders}
						roles={roles}
					/>
				</div>
			</Disclosure.Content>
		</Disclosure>
	);
}

interface LevelUpMessageEmbedProps {
	readonly emojis: Emoji[];
	readonly roles: Role[];
	readonly defaultValue: Embed | null;
}
