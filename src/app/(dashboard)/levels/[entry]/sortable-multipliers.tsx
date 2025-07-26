"use client";

import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import { useState } from "react";
import { SidebarSection } from "@/components/leaderboard/SidebarSection.tsx";
import { type Multiplier, MultiplierDisplay } from "./04-multiplier.tsx";

export function SortableMultipliers({ multipliers }: SortableMultipliersProps) {
	const [sortAscending, setSortAscending] = useState(true);

	if (multipliers.length === 0) {
		return null;
	}

	const sortedMultipliers = [...multipliers].sort((a, b) => {
		return sortAscending ? a.multiplier - b.multiplier : b.multiplier - a.multiplier;
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
		<SidebarSection title="Multipliers" titleAction={sortButton}>
			<div className="flex flex-col gap-4">
				{sortedMultipliers.map((multiplier) => (
					<MultiplierDisplay key={multiplier.id} {...multiplier} />
				))}
			</div>
		</SidebarSection>
	);
}

interface SortableMultipliersProps {
	multipliers: Multiplier[];
}
