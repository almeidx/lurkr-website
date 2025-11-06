"use client";

import { type Multiplier, MultiplierDisplay } from "./04-multiplier.tsx";
import { SortableSection } from "./sortable-section.tsx";

export function SortableMultipliers({ globalMultiplier, multipliers }: SortableMultipliersProps) {
	const headerContent =
		globalMultiplier !== 1 ? (
			<div className="flex items-center gap-4">
				<span className="flex size-9 items-center justify-center rounded-lg border border-white/25 bg-darker text-[#fff]">
					{globalMultiplier}
				</span>
				<p className="text-sm">Global</p>
			</div>
		) : null;

	return (
		<SortableSection
			data={multipliers}
			headerContent={headerContent}
			keyExtractor={(multiplier) => multiplier.id}
			renderItem={(multiplier) => <MultiplierDisplay {...multiplier} />}
			sortBy={(multiplier) => multiplier.multiplier}
			title="Multipliers"
		/>
	);
}

interface SortableMultipliersProps {
	globalMultiplier: number;
	multipliers: Multiplier[];
}
