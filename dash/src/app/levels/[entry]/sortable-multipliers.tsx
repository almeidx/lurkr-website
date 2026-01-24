"use client";

import { Chip } from "@heroui/react";
import { type Multiplier, MultiplierDisplay } from "./04-multiplier.tsx";
import { SortableSection } from "./sortable-section.tsx";

export function SortableMultipliers({ globalMultiplier, multipliers }: SortableMultipliersProps) {
	const headerContent =
		globalMultiplier !== 1 ? (
			<div className="flex items-center gap-4">
				<Chip className="shrink-0 font-semibold" size="sm" variant="soft">
					{globalMultiplier}x
				</Chip>
				<Chip size="sm" variant="soft">
					Global
				</Chip>
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
