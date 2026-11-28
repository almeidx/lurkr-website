import { ChannelSelector } from "@/components/dashboard/ChannelSelector.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { limitFor, limitLabel } from "@/lib/guild-config.ts";
import type { Channel } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";
import { mapChannelIdsToChannels } from "@/utils/map-channel-ids-to-channels.ts";

export function LimitedChannelSelector({
	channels,
	defaultValues,
	inputId,
	label,
	limit,
	menuPlacement,
	premium,
}: LimitedChannelSelectorProps) {
	return (
		<ChannelSelector
			channels={channels}
			defaultValues={mapChannelIdsToChannels(defaultValues, channels)}
			inputId={inputId}
			max={limitFor(limit, premium)}
			menuPlacement={menuPlacement}
			settingId={limit}
		>
			<Label sub={limitLabel(limit)}>{label}</Label>
		</ChannelSelector>
	);
}

interface LimitedChannelSelectorProps {
	readonly channels: Channel[];
	readonly defaultValues: Snowflake[];
	readonly inputId: string;
	readonly label: string;
	readonly limit: "autoPublishChannels" | "xpChannels";
	readonly menuPlacement?: "auto" | "top" | "bottom";
	readonly premium: boolean;
}
