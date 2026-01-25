import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import Link from "next/link";

export const LEADERBOARD_ENTRIES_PER_PAGE = 100;
export const LEADERBOARD_MAX_PAGE = 100;

export function PageSelector({ amount, entry, page }: PageSelectorProps) {
	const isPossiblyLastPage = amount < LEADERBOARD_ENTRIES_PER_PAGE;
	const hasPrevious = page > 1;
	const hasNext = !isPossiblyLastPage && page < LEADERBOARD_MAX_PAGE;

	// Show more pages: current page, 2 before, 2 after
	const pages: number[] = [];
	if (page <= 3) {
		// Near the start
		for (let i = 1; i <= Math.min(5, LEADERBOARD_MAX_PAGE); i++) {
			if (!isPossiblyLastPage || i <= page) {
				pages.push(i);
			}
		}
	} else if (page >= LEADERBOARD_MAX_PAGE - 2) {
		// Near the end
		for (let i = Math.max(1, LEADERBOARD_MAX_PAGE - 4); i <= LEADERBOARD_MAX_PAGE; i++) {
			if (!isPossiblyLastPage || i <= page) {
				pages.push(i);
			}
		}
	} else {
		// In the middle
		for (let i = page - 2; i <= page + 2; i++) {
			if (i >= 1 && i <= LEADERBOARD_MAX_PAGE && (!isPossiblyLastPage || i <= page)) {
				pages.push(i);
			}
		}
	}

	return (
		<div className="flex items-center justify-center gap-2">
			{hasPrevious ? (
				<Link
					className="flex items-center justify-center rounded border border-white/10 bg-white/5 px-2 py-1.5 text-white/60 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
					href={`/levels/${entry}?page=${page - 1}`}
					prefetch={false}
				>
					<RiArrowLeftSLine className="size-4" />
				</Link>
			) : (
				<div className="pointer-events-none flex items-center justify-center rounded border border-white/10 bg-white/5 px-2 py-1.5 text-white/40 opacity-30">
					<RiArrowLeftSLine className="size-4" />
				</div>
			)}

			<div className="flex items-center gap-1">
				{pages.map((num) => {
					const isDisabled = isPossiblyLastPage && num > page;
					const isActive = page === num;

					return isDisabled ? (
						<div
							className="pointer-events-none flex items-center justify-center rounded px-3 py-1.5 text-white/40 opacity-30"
							key={`${page}-${num}`}
						>
							{num}
						</div>
					) : (
						<Link
							className={`flex items-center justify-center rounded px-3 py-1.5 font-medium text-sm transition-colors ${
								isActive ? "bg-primary text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
							}`}
							href={`/levels/${entry}?page=${num}`}
							key={`${page}-${num}`}
							prefetch={false}
						>
							{num}
						</Link>
					);
				})}
			</div>

			{hasNext ? (
				<Link
					className="flex items-center justify-center rounded border border-white/10 bg-white/5 px-2 py-1.5 text-white/60 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
					href={`/levels/${entry}?page=${page + 1}`}
					prefetch={false}
				>
					<RiArrowRightSLine className="size-4" />
				</Link>
			) : (
				<div className="pointer-events-none flex items-center justify-center rounded border border-white/10 bg-white/5 px-2 py-1.5 text-white/40 opacity-30">
					<RiArrowRightSLine className="size-4" />
				</div>
			)}
		</div>
	);
}

interface PageSelectorProps {
	readonly amount: number;
	readonly entry: string;
	readonly page: number;
}
