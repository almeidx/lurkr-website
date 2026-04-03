import type { Channel } from "@/lib/guild.ts";
import type { Snowflake } from "@/utils/discord-cdn.ts";

export function mapChannelIdsToChannels(channelIds: Snowflake[] | Snowflake | null, channels: Channel[]) {
	const channelIdsArray = Array.isArray(channelIds) ? channelIds : channelIds ? [channelIds] : [];

	return channelIdsArray.flatMap((channelId) => {
		const channel = channels.find((c) => c.id === channelId);
		return channel ? [channel] : [];
	});
}
