"use client";

import { type Multiplier, MultiplierDisplay } from "./04-multiplier.tsx";
import { SortableSection } from "./sortable-section.tsx";

export function SortableMultipliers({ globalMultiplier, multipliers }: SortableMultipliersProps) {
	const headerContent =
		globalMultiplier !== 1 ? (
			<div className="rounded-2xl border-2 border-warning/30 bg-gradient-to-br from-warning/20 to-warning/10 p-4">
				<div className="flex items-center gap-3">
					<span className="rounded-lg border-2 border-warning/40 bg-warning/30 px-4 py-2 font-black text-lg text-warning">
						{globalMultiplier}x
					</span>
					<span className="font-bold text-sm text-white/70 uppercase tracking-wider">Global Multiplier</span>
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
