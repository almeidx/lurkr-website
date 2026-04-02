import { createRouter } from "@tanstack/react-router";
import { ErrorBoundary } from "@/components/error-boundary.tsx";
import { NotFound } from "@/components/not-found.tsx";
import { docsRoute } from "@/lib/shared.ts";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	return createRouter({
		basepath: docsRoute,
		defaultErrorComponent: ErrorBoundary,
		defaultNotFoundComponent: NotFound,
		defaultPreload: "intent",
		routeTree,
		scrollRestoration: true,
	});
}
