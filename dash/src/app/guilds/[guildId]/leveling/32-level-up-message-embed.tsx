import { Disclosure, DisclosureContent, DisclosureProvider } from "@ariakit/react";
import { EmbedBuilder } from "@/components/dashboard/embed/EmbedBuilder.tsx";
import { ExpandMore } from "@/components/icons/mdi/expand-more.tsx";
import type { Embed, Emoji, Role } from "@/lib/guild.ts";
import { levelUpMessagePlaceholders } from "./level-up-message-placeholders.ts";

export function LevelUpMessageEmbed({ defaultValue, emojis, roles }: LevelUpMessageEmbedProps) {
	return (
		<div className="flex flex-col">
			<DisclosureProvider>
				<Disclosure className="group flex max-w-3xl items-center justify-between gap-1 rounded-lg border border-white/25 bg-dark-gray px-2 py-1.5 hover:bg-dark-gray/50 aria-expanded:mb-0 aria-expanded:rounded-t-lg aria-expanded:rounded-b-none">
					Embed
					<ExpandMore className="transition ease-in-out group-aria-expanded:rotate-180" />
				</Disclosure>

				<DisclosureContent className="flex max-w-3xl flex-col rounded-b-lg border border-white/25 bg-dark-gray px-2 py-1.5">
					<EmbedBuilder
						defaultValue={defaultValue}
						emojis={emojis}
						placeholders={levelUpMessagePlaceholders}
						roles={roles}
					/>
				</DisclosureContent>
			</DisclosureProvider>
		</div>
	);
}

interface LevelUpMessageEmbedProps {
	readonly emojis: Emoji[];
	readonly roles: Role[];
	readonly defaultValue: Embed | null;
}
