"use client";

import { type Multiplier, MultiplierDisplay } from "./04-multiplier.tsx";
import { SortableSection } from "./sortable-section.tsx";

export function SortableMultipliers({ globalMultiplier, multipliers }: SortableMultipliersProps) {
	const headerContent =
		globalMultiplier !== 1 ? (
			<div className="rounded-lg border border-warning/20 bg-warning/10 p-3">
				<div className="flex items-center gap-2">
					<span className="rounded border border-warning/30 bg-warning/20 px-2 py-1 font-semibold text-sm text-warning">
						{globalMultiplier}x
					</span>
					<span className="font-medium text-white/70 text-xs">Global</span>
				</div>
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
