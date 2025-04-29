import { generateFiles } from "fumadocs-openapi";

await generateFiles({
	input: ["https://api.lurkr.gg/v2/docs/json"],
	output: "./content/api/endpoints",
	includeDescription: true,
});
