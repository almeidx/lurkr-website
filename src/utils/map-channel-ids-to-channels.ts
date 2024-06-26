import type { Channel } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function mapChannelIdsToChannels(channelIds: Snowflake[] | Snowflake | null, channels: Channel[]) {
	const channelIdsArray = Array.isArray(channelIds) ? channelIds : channelIds ? [channelIds] : [];

	return channelIdsArray
		.map((channelId) => channels.find((channel) => channel.id === channelId))
		.filter((channel) => channel !== undefined);
}
