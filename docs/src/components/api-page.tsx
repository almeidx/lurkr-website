import { createAPIPage } from "fumadocs-openapi/ui";
import { openapi } from "@/lib/openapi.ts";

export const APIPage = createAPIPage(openapi, {
	playground: {
		enabled: false,
	},
});
