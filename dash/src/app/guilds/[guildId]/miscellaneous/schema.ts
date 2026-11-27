import { object } from "valibot";
import { limitFor } from "@/lib/guild-config.ts";
import { snowflakeList, toggle } from "@/utils/schemas.ts";

export function schema(premium: boolean) {
	return object({
		autoPublishChannels: snowflakeList(limitFor("autoPublishChannels", premium)),
		storeCounts: toggle,
	});
}
