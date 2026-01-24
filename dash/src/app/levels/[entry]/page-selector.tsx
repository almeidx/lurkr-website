import { Button } from "@heroui/react";
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

				return isDisabled ? (
					<Button
						className="min-w-12"
						disabled
						isIconOnly
						key={`${page}-${num}`}
						size="sm"
						variant={page === num ? "primary" : "ghost"}
					>
						{num}
					</Button>
				) : (
					<Button
						as={Link}
						className="min-w-12"
						href={`/levels/${entry}?page=${num}`}
						isIconOnly
						key={`${page}-${num}`}
						size="sm"
						variant={page === num ? "primary" : "ghost"}
					>
						{num}
					</Button>
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
