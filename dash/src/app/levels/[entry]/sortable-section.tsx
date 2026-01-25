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
				className="rounded-xl border-2 border-white/10 bg-white/5 px-3 py-1.5 font-bold text-white/60 text-xs uppercase tracking-wider transition-all hover:border-white/20 hover:bg-white/10 hover:text-white hover:shadow-lg"
				onClick={toggleSort}
				type="button"
			>
				{sortAscending ? "↑ ASC" : "↓ DESC"}
			</button>
		) : null;

	return (
		<div className="relative overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/[0.02] backdrop-blur-sm">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.08),transparent_70%)]" />
			<div className="relative flex items-center justify-between border-white/10 border-b-2 px-6 py-5">
				<h3 className="font-black text-sm text-white/70 uppercase tracking-[0.2em]">{title}</h3>
				{sortButton}
			</div>
			<div className="relative p-6">
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
