import { type Multiplier, MultiplierDisplay } from "./04-multiplier.tsx";
import { SortableSection } from "./sortable-section.tsx";

export function SortableMultipliers({ multipliers }: SortableMultipliersProps) {
	return (
		<SortableSection
			data={multipliers}
			title="Multipliers"
			sortBy={(multiplier) => multiplier.multiplier}
			renderItem={(multiplier) => <MultiplierDisplay {...multiplier} />}
			keyExtractor={(multiplier) => multiplier.id}
		/>
	);
}

interface SortableMultipliersProps {
	multipliers: Multiplier[];
}
