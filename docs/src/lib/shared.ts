import { GITHUB_REPOSITORY_NAME, GITHUB_REPOSITORY_OWNER } from "@/shared-links.ts";
import { ROUTER_BASEPATH } from "@/utils/constants.ts";

export const appName = "Lurkr Docs";
export const docsRoute = ROUTER_BASEPATH;
export const docsContentRoute = `${docsRoute}/llms.mdx/docs`;

export function resolvePageUrl(pageUrl: string) {
	return `${docsRoute}${pageUrl.replace(/\/$/, "")}`;
}

export const gitConfig = {
	branch: "main",
	repo: GITHUB_REPOSITORY_NAME,
	user: GITHUB_REPOSITORY_OWNER,
};
