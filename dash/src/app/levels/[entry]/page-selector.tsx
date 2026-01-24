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
		<div className="flex items-center justify-center gap-2">
			{pages.map((num) => {
				const isDisabled = isPossiblyLastPage && num > page;
				const isActive = page === num;

				const buttonClasses = clsx(
					"min-w-12 flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all",
					isActive
						? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/20"
						: "border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white",
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
