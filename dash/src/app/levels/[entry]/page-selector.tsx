import clsx from "clsx";
import Link from "next/link";

export const LEADERBOARD_ENTRIES_PER_PAGE = 100;
export const LEADERBOARD_MAX_PAGE = 100;

export function PageSelector({ amount, entry, page }: PageSelectorProps) {
	const isPossiblyLastPage = amount < LEADERBOARD_ENTRIES_PER_PAGE;

	let pages: [number, number, number];

	if (page === 1) {
		pages = [1, 2, 3];
	} else if (page === LEADERBOARD_MAX_PAGE) {
		pages = [page - 2, page - 1, page];
	} else {
		pages = [page - 1, page, page + 1];
	}

	return (
		<div className="flex items-center justify-center gap-1">
			{pages.map((num) => {
				const isDisabled = isPossiblyLastPage && num > page;

				return isDisabled ? (
					<div
						className={clsx(
							"flex size-10 items-center justify-center rounded-lg px-2 py-1 font-semibold opacity-50 transition-colors",
							page === num ? "bg-light-gray" : "bg-dark-gray",
						)}
						key={`${page}-${num}`}
					>
						{num}
					</div>
				) : (
					<Link
						aria-current={page === num ? "page" : undefined}
						className={clsx(
							"flex size-10 items-center justify-center rounded-lg px-2 py-1 font-semibold transition-colors",
							page === num ? "bg-light-gray hover:bg-light-gray/75" : "bg-dark-gray hover:bg-dark-gray/75",
						)}
						href={`/levels/${entry}?page=${num}`}
						key={`${page}-${num}`}
						prefetch={false}
					>
						{num}
					</Link>
				);
			})}
		</div>
	);
}

interface PageSelectorProps {
	readonly amount: number;
	readonly entry: string;
	readonly page: number;
}
