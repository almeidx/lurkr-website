import type { Snowflake } from "@/utils/discord-cdn.ts";
import clsx from "clsx";
import Link from "next/link";

const perPage = 100;

export function PageSelector({ amount, guildId, page }: PageSelectorProps) {
	const pages = page > 1 ? [page - 1, page, page + 1] : [page, page + 1, page + 2];
	const isLastPage = amount < perPage;

	return (
		<div className="flex items-center justify-center gap-1">
			{pages.map((num) => (
				<Link
					key={`${page}-${num}`}
					className={clsx(
						"flex h-10 w-10 items-center justify-center rounded-lg px-2 py-1 font-semibold transition-colors",
						page === num ? "bg-light-gray hover:bg-light-gray/75" : "bg-dark-gray hover:bg-dark-gray/75",
						isLastPage ? "pointer-events-none opacity-50" : "cursor-pointer",
					)}
					href={isLastPage ? `/levels/${guildId}?page=${page}` : `/levels/${guildId}?page=${num}`}
				>
					{num}
				</Link>
			))}
		</div>
	);
}

interface PageSelectorProps {
	readonly amount: number;
	readonly guildId: Snowflake;
	readonly page: number;
}
