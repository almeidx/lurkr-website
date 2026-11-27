import { safeParse } from "valibot";
import { describe, expect, it } from "vitest";
import { snowflakes } from "@/test/snowflakes.ts";
import { schema } from "./schema.ts";

describe("miscellaneous schema", () => {
	it("parses a submitted form", () => {
		const result = safeParse(schema(false), {
			autoPublishChannels: "123456789012345678,223456789012345678",
			storeCounts: "on",
		});

		expect(result.output).toEqual({
			autoPublishChannels: ["123456789012345678", "223456789012345678"],
			storeCounts: true,
		});
	});

	it("parses a form with everything turned off", () => {
		expect(safeParse(schema(false), { autoPublishChannels: "" }).output).toEqual({
			autoPublishChannels: [],
			storeCounts: false,
		});
	});

	it("limits a regular server to 5 auto-publish channels", () => {
		expect(safeParse(schema(false), { autoPublishChannels: snowflakes(5).join(",") }).success).toBe(true);
		expect(safeParse(schema(false), { autoPublishChannels: snowflakes(6).join(",") }).success).toBe(false);
	});

	it("limits a premium server to 25 auto-publish channels", () => {
		expect(safeParse(schema(true), { autoPublishChannels: snowflakes(25).join(",") }).success).toBe(true);
		expect(safeParse(schema(true), { autoPublishChannels: snowflakes(26).join(",") }).success).toBe(false);
	});
});
