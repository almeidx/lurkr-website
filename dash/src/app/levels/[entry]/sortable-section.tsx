"use client";

import { Button } from "@heroui/react";
import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
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
			<Button
				aria-label={`Sort ${sortAscending ? "descending" : "ascending"}`}
				className="-mr-1 min-w-0"
				isIconOnly
				onPress={toggleSort}
				size="sm"
				variant="ghost"
			>
				{sortAscending ? <RiArrowUpSLine className="size-4" /> : <RiArrowDownSLine className="size-4" />}
			</Button>
		) : null;

	return (
		<div className="rounded-xl border border-white/10 bg-white/5">
			<div className="flex items-center justify-between border-white/10 border-b px-4 py-3">
				<h3 className="font-semibold text-sm text-white/60 uppercase tracking-wider">{title}</h3>
				{sortButton}
			</div>
			<div className="p-4">
				<div className="flex flex-col gap-2.5">
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
