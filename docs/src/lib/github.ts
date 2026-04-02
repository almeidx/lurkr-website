import { GITHUB_REPOSITORY_NAME, GITHUB_REPOSITORY_OWNER } from "@/shared-links.ts";

export type GitHubRepositoryStats = {
	forks: number;
	stars: number;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPOSITORY_OWNER}/${GITHUB_REPOSITORY_NAME}`;
const USER_AGENT = `${GITHUB_REPOSITORY_OWNER}-${GITHUB_REPOSITORY_NAME}-docs`;

let cache:
	| {
			expiresAt: number;
			value: GitHubRepositoryStats | null;
	  }
	| undefined;
let inflight: Promise<GitHubRepositoryStats | null> | undefined;

function getGithubToken() {
	const maybeProcess = globalThis as typeof globalThis & {
		process?: {
			env?: Record<string, string | undefined>;
		};
	};

	return maybeProcess.process?.env?.GITHUB_TOKEN;
}

async function fetchGitHubRepositoryStats() {
	const headers = new Headers({
		Accept: "application/vnd.github+json",
		"User-Agent": USER_AGENT,
	});
	const token = getGithubToken();

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	try {
		const response = await fetch(GITHUB_API_URL, {
			headers,
		});

		if (!response.ok) {
			return null;
		}

		const data = (await response.json()) as {
			forks_count?: number;
			stargazers_count?: number;
		};

		if (typeof data.forks_count !== "number" || typeof data.stargazers_count !== "number") {
			return null;
		}

		return {
			forks: data.forks_count,
			stars: data.stargazers_count,
		} satisfies GitHubRepositoryStats;
	} catch {
		return null;
	}
}

export async function getGitHubRepositoryStats() {
	const now = Date.now();

	if (cache && cache.expiresAt > now) {
		return cache.value;
	}

	if (inflight) {
		return inflight;
	}

	inflight = fetchGitHubRepositoryStats()
		.then((value) => {
			cache = {
				expiresAt: now + CACHE_TTL_MS,
				value: value ?? cache?.value ?? null,
			};

			return cache.value;
		})
		.finally(() => {
			inflight = undefined;
		});

	return inflight;
}
