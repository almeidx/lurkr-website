import { createAPIPage } from "fumadocs-openapi/ui";
import { openapi } from "@/lib/openapi";
import client from "./api-page.client.tsx";

export const APIPage = createAPIPage(openapi, {
	client,
	playground: {
		enabled: false,
	},
});
