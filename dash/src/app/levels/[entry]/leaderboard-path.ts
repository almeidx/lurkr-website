export const LEADERBOARD_ENTRIES_PER_PAGE = 100;
export const LEADERBOARD_MAX_PAGE = 100;

export function leaderboardPath(entry: string, page: number) {
	return page === 1 ? `/levels/${entry}` : `/levels/${entry}?page=${page}`;
}
