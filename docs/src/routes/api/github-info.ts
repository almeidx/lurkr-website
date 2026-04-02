import { createFileRoute } from "@tanstack/react-router";
import { getGitHubRepositoryStats } from "@/lib/github.ts";

export const Route = createFileRoute("/api/github-info")({
	server: {
		handlers: {
			GET: async () =>
				Response.json(await getGitHubRepositoryStats(), {
					headers: {
						"Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
					},
				}),
		},
	},
});
