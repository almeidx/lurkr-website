import { type Multiplier, MultiplierDisplay } from "./04-multiplier.tsx";
import { SortableSection } from "./sortable-section.tsx";

export function SortableMultipliers({ multipliers }: SortableMultipliersProps) {
	return (
		<SortableSection
			data={multipliers}
			keyExtractor={(multiplier) => multiplier.id}
			renderItem={(multiplier) => <MultiplierDisplay {...multiplier} />}
			sortBy={(multiplier) => multiplier.multiplier}
			title="Multipliers"
		/>
	);
}

interface SortableMultipliersProps {
	multipliers: Multiplier[];
}
