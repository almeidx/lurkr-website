import clsx from "clsx";
import Link from "next/link";

const perPage = 100;

export function PageSelector({ amount, entry, page }: PageSelectorProps) {
	const pages = page > 1 ? [page - 1, page, page + 1] : [page, page + 1, page + 2];
	const isPastEnd = amount < perPage;

	return (
		<div className="flex items-center justify-center gap-1">
			{pages.map((num, idx) => (
				<Link
					key={`${page}-${num}`}
					className={clsx(
						"flex size-10 items-center justify-center rounded-lg px-2 py-1 font-semibold transition-colors",
						page === num ? "bg-light-gray hover:bg-light-gray/75" : "bg-dark-gray hover:bg-dark-gray/75",
						isPastEnd && idx !== 0 ? "pointer-events-none opacity-50" : "cursor-pointer",
					)}
					href={isPastEnd && idx !== 0 ? `/levels/${entry}?page=${page}` : `/levels/${entry}?page=${num}`}
				>
					{num}
				</Link>
			))}
		</div>
	);
}

interface PageSelectorProps {
	readonly amount: number;
	readonly entry: string;
	readonly page: number;
}
