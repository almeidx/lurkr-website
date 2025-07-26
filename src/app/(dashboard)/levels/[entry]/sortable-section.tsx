"use client";

import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import { useState } from "react";
import { SidebarSection } from "@/components/leaderboard/SidebarSection.tsx";

export function SortableSection<T>({ data, title, sortBy, renderItem, keyExtractor }: SortableSectionProps<T>) {
	const [sortAscending, setSortAscending] = useState(true);

	if (data.length === 0) {
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

	const sortButton = (
		<button
			aria-label={`Sort ${sortAscending ? "descending" : "ascending"}`}
			className="flex items-center gap-1 text-gray-400 text-sm transition-colors hover:text-white"
			onClick={toggleSort}
			type="button"
		>
			{sortAscending ? <RiArrowUpSLine className="size-4" /> : <RiArrowDownSLine className="size-4" />}
			{sortAscending ? "Asc" : "Desc"}
		</button>
	);

	return (
		<SidebarSection title={title} titleAction={sortButton}>
			<div className="flex flex-col gap-4">
				{sortedData.map((item) => (
					<div key={keyExtractor(item)}>{renderItem(item)}</div>
				))}
			</div>
		</SidebarSection>
	);
}

interface SortableSectionProps<T> {
	data: T[];
	title: string;
	sortBy: (item: T) => number;
	renderItem: (item: T) => React.ReactNode;
	keyExtractor: (item: T) => string;
}
