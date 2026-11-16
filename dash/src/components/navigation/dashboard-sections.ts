import type { ComponentType, SVGProps } from "react";
import { EmojiEmotions } from "@/components/icons/mdi/emoji-emotions.tsx";
import { FormatListBulleted } from "@/components/icons/mdi/format-list-bulleted.tsx";
import { MiscellaneousServices } from "@/components/icons/mdi/miscellaneous-services.tsx";
import { RocketLaunch } from "@/components/icons/mdi/rocket-launch.tsx";
import { Settings } from "@/components/icons/mdi/settings.tsx";
import { Signpost } from "@/components/icons/mdi/signpost.tsx";
import { SmartToy } from "@/components/icons/mdi/smart-toy.tsx";
import { TrendingUp } from "@/components/icons/mdi/trending-up.tsx";
import { Warning } from "@/components/icons/mdi/warning.tsx";
import type { Snowflake } from "@/utils/discord-cdn.ts";

interface DashboardSection {
	readonly danger?: boolean;
	readonly icon: ComponentType<SVGProps<SVGSVGElement>>;
	readonly iconClassName?: string;
	readonly label: string;
	/** The path segment after `/guilds/[guildId]`; empty for the overview. */
	readonly path: string;
}

export const DASHBOARD_SECTIONS: readonly DashboardSection[] = [
	{ icon: Settings, label: "Overview", path: "" },
	{ icon: TrendingUp, iconClassName: "text-brand", label: "Leveling", path: "leveling" },
	{ icon: SmartToy, label: "Import Bots", path: "import" },
	{ icon: RocketLaunch, iconClassName: "text-[#82cbff]", label: "Multipliers", path: "multipliers" },
	{ icon: FormatListBulleted, iconClassName: "text-[#d2ffae]", label: "Role Management", path: "roles" },
	{ icon: Signpost, iconClassName: "text-[#804994]", label: "Milestones", path: "milestones" },
	{ icon: EmojiEmotions, iconClassName: "text-[#ffe87c]", label: "Emoji List", path: "emojis" },
	{ icon: MiscellaneousServices, iconClassName: "text-[#73ffc4]", label: "Miscellaneous", path: "miscellaneous" },
	{ danger: true, icon: Warning, iconClassName: "text-[#ff9254]", label: "Danger Zone", path: "danger" },
];

export function sectionHref(guildId: Snowflake, path: string) {
	return path ? `/guilds/${guildId}/${path}` : `/guilds/${guildId}`;
}
