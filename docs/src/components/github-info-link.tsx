import { GitFork, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn.ts";
import type { GitHubRepositoryStats } from "@/lib/github.ts";
import { docsRoute } from "@/lib/shared.ts";
import { GITHUB_REPOSITORY_NAME, GITHUB_REPOSITORY_OWNER, GITHUB_REPOSITORY_URL } from "@/shared-links.ts";

const formatter = new Intl.NumberFormat("en", {
	maximumFractionDigits: 1,
	notation: "compact",
});

const LOCAL_CACHE_KEY = "lurkr-docs:github-repository-stats";
const LOCAL_CACHE_TTL_MS = 60 * 60 * 1000;

type StoredGitHubRepositoryStats = GitHubRepositoryStats & {
	fetchedAt: number;
};

function isStoredGitHubRepositoryStats(value: unknown): value is StoredGitHubRepositoryStats {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const candidate = value as Record<string, unknown>;

	return (
		typeof candidate.fetchedAt === "number" &&
		typeof candidate.forks === "number" &&
		typeof candidate.stars === "number"
	);
}

function readStoredGitHubRepositoryStats() {
	if (typeof window === "undefined") {
		return null;
	}

	try {
		const raw = window.localStorage.getItem(LOCAL_CACHE_KEY);
		if (!raw) {
			return null;
		}

		const parsed = JSON.parse(raw) as unknown;

		if (!isStoredGitHubRepositoryStats(parsed)) {
			return null;
		}

		return parsed;
	} catch {
		return null;
	}
}

function writeStoredGitHubRepositoryStats(stats: GitHubRepositoryStats) {
	if (typeof window === "undefined") {
		return;
	}

	try {
		window.localStorage.setItem(
			LOCAL_CACHE_KEY,
			JSON.stringify({
				...stats,
				fetchedAt: Date.now(),
			} satisfies StoredGitHubRepositoryStats),
		);
	} catch {}
}

export function GitHubInfoLink() {
	const [stats, setStats] = useState<GitHubRepositoryStats | null>(null);

	useEffect(() => {
		const cached = readStoredGitHubRepositoryStats();
		if (cached) {
			setStats(cached);

			if (Date.now() - cached.fetchedAt < LOCAL_CACHE_TTL_MS) {
				return;
			}
		}

		const controller = new AbortController();

		void (async () => {
			try {
				const response = await fetch(`${docsRoute}/api/github-info`, {
					headers: {
						Accept: "application/json",
					},
					signal: controller.signal,
				});

				if (!response.ok) {
					return;
				}

				const data = (await response.json()) as GitHubRepositoryStats | null;

				if (!data) {
					return;
				}

				setStats(data);
				writeStoredGitHubRepositoryStats(data);
			} catch {}
		})();

		return () => {
			controller.abort();
		};
	}, []);

	return (
		<a
			className={cn(
				"flex flex-col gap-1.5 rounded-lg p-2 text-fd-foreground/80 text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
			)}
			href={GITHUB_REPOSITORY_URL}
			rel="noreferrer noopener"
			target="_blank"
		>
			<p className="flex items-center gap-2 truncate">
				<svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
					<title>GitHub</title>
					<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
				</svg>
				{GITHUB_REPOSITORY_OWNER}/{GITHUB_REPOSITORY_NAME}
			</p>
			{stats ? (
				<div className="flex items-center gap-1 text-fd-muted-foreground text-xs">
					<Star className="size-3" />
					<span>{formatter.format(stats.stars)}</span>
					<GitFork className="ms-2 size-3" />
					<span>{formatter.format(stats.forks)}</span>
				</div>
			) : null}
		</a>
	);
}
