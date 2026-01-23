"use client";

import { Button, Card } from "@heroui/react";
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
				className="min-w-0"
				isIconOnly
				size="sm"
				variant="light"
				onPress={toggleSort}
			>
				{sortAscending ? <RiArrowUpSLine className="size-4" /> : <RiArrowDownSLine className="size-4" />}
			</Button>
		) : null;

	return (
		<Card className="border border-white/10 bg-white/5">
			<Card.Header className="flex items-center justify-between border-b border-white/10 pb-4">
				<Card.Title className="text-lg font-semibold">{title}</Card.Title>
				{sortButton}
			</Card.Header>
			<Card.Content className="px-6 py-4">
				<div className="flex flex-col gap-4">
					{headerContent}
					{sortedData.map((item) => (
						<div key={keyExtractor(item)}>{renderItem(item)}</div>
					))}
				</div>
			</Card.Content>
		</Card>
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
