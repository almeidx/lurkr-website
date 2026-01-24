"use client";

import { useState } from "react";

export function SortableSection<T>({
	data,
	title,
	sortBy,
	renderItem,
	keyExtractor,
	headerContent,
}: SortableSectionProps<T>) {
	const [sortAscending, setSortAscending] = useState(true);

	if (data.length === 0 && !headerContent) {
		return null;
	}

	const sortedData = data.toSorted((a, b) => {
		const aValue = sortBy(a);
		const bValue = sortBy(b);
		return sortAscending ? aValue - bValue : bValue - aValue;
	});

	function toggleSort() {
		setSortAscending((previousValue) => !previousValue);
	}

	const sortButton =
		data.length > 0 ? (
			<button
				aria-label={`Sort ${sortAscending ? "descending" : "ascending"}`}
				className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-medium text-white/60 text-xs transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
				onClick={toggleSort}
				type="button"
			>
				{sortAscending ? "↑ Low to High" : "↓ High to Low"}
			</button>
		) : null;

	return (
		<div className="rounded-2xl border border-white/10 bg-white/5">
			<div className="flex items-center justify-between border-white/10 border-b px-5 py-4">
				<h3 className="font-bold text-sm text-white/70 uppercase tracking-wider">{title}</h3>
				{sortButton}
			</div>
			<div className="p-5">
				<div className="flex flex-col gap-3">
					{headerContent}
					{sortedData.map((item) => (
						<div key={keyExtractor(item)}>{renderItem(item)}</div>
					))}
				</div>
			</div>
		</div>
	);
}

interface SortableSectionProps<T> {
	data: T[];
	title: string;
	sortBy: (item: T) => number;
	renderItem: (item: T) => React.ReactNode;
	keyExtractor: (item: T) => string;
	headerContent?: React.ReactNode;
}
