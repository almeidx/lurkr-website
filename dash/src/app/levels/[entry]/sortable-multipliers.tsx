"use client";

import { type Multiplier, MultiplierDisplay } from "./04-multiplier.tsx";
import { SortableSection } from "./sortable-section.tsx";

export function SortableMultipliers({ globalMultiplier, multipliers }: SortableMultipliersProps) {
	const headerContent =
		globalMultiplier !== 1 ? (
			<div className="rounded-lg border border-white/10 bg-gradient-to-br from-warning/10 to-warning/5 p-3">
				<div className="flex items-center gap-2">
					<div className="flex size-6 items-center justify-center rounded-md bg-warning/20 font-semibold text-warning text-xs">
						{globalMultiplier}x
					</div>
					<span className="font-medium text-sm">Global Multiplier</span>
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
