import { safeParse } from "valibot";
import { describe, expect, it } from "vitest";
import { schema } from "./schema.ts";

describe("emojis schema", () => {
	it("parses an enabled emoji list with its channel", () => {
		const result = safeParse(schema, { emojiList: "on", emojiListChannel: "123456789012345678" });

		expect(result.output).toEqual({ emojiList: true, emojiListChannel: "123456789012345678" });
	});

	it("parses a disabled emoji list without a channel", () => {
		const result = safeParse(schema, { emojiListChannel: "" });

		expect(result.output).toEqual({ emojiList: false, emojiListChannel: null });
	});

	it("rejects a channel that is not an ID", () => {
		expect(safeParse(schema, { emojiList: "on", emojiListChannel: "general" }).success).toBe(false);
	});
});
