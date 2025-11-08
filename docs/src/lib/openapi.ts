import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
	input: ["https://api.lurkr.gg/v2/docs/json"],
});
