import { object } from "valibot";
import { snowflake, toggle } from "@/utils/schemas.ts";

export const schema = object({
	emojiList: toggle,
	emojiListChannel: snowflake,
});
