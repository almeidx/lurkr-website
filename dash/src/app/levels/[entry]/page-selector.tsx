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
		<div className="flex items-center justify-center gap-1.5">
			{pages.map((num) => {
				const isDisabled = isPossiblyLastPage && num > page;
				const isActive = page === num;

				const buttonClasses = clsx(
					"min-w-10 flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
					isActive ? "bg-primary text-white" : "text-white/60 hover:bg-white/5 hover:text-white",
					isDisabled && "pointer-events-none opacity-30",
				);

				return isDisabled ? (
					<div className={buttonClasses} key={`${page}-${num}`}>
						{num}
					</div>
				) : (
					<Link className={buttonClasses} href={`/levels/${entry}?page=${num}`} key={`${page}-${num}`} prefetch={false}>
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
