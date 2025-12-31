import { Surface } from "@heroui/react";
import type { ConfigLimitComparison, LevelingFeature } from "@/app/premium/features.ts";
import { Check } from "@/components/icons/mdi/check.tsx";
import { Close } from "@/components/icons/mdi/close.tsx";

export function ComparisonTable({ section, features }: ComparisonTableProps) {
	const isConfigLimit = "suffix" in features[0]!;

	return (
		<Surface className="overflow-hidden rounded-2xl">
			<table aria-label={`${section} comparison table`} className="w-full border-collapse">
				<thead>
					<tr className="border-white/10 border-b">
						<th className="px-4 py-3 text-left font-bold text-lg md:text-2xl">{section}</th>
						<th className="w-fit max-w-40 px-4 py-3 text-center font-bold text-lg md:w-40 md:text-2xl">Free</th>
						<th className="w-fit max-w-40 px-4 py-3 text-center font-bold text-lg md:w-40 md:text-2xl">Max</th>
						<th className="w-fit max-w-40 px-4 py-3 text-center font-bold text-lg md:w-40 md:text-2xl">Ultimate</th>
					</tr>
				</thead>

				<tbody>
					{features.map((feature, index) => (
						<tr className={index < features.length - 1 ? "border-white/10 border-b" : ""} key={feature.name}>
							<td className="text-wrap px-4 py-3">{feature.name}</td>
							<td className="px-4 py-3 text-center">
								{isConfigLimit ? (
									`${feature.free} ${(feature as ConfigLimitComparison).suffix}`
								) : feature.free ? (
									<Check aria-label="Included" className="mx-auto size-8 text-[#93e19c]" />
								) : (
									<Close aria-label="Not included" className="mx-auto size-8 text-red" />
								)}
							</td>
							<td className="px-4 py-3 text-center">
								{isConfigLimit ? (
									`${(feature as ConfigLimitComparison).max ?? feature.free} ${(feature as ConfigLimitComparison).suffix}`
								) : (feature as LevelingFeature).max ? (
									<Check aria-label="Included" className="mx-auto size-8 text-[#93e19c]" />
								) : (
									<Close aria-label="Not included" className="mx-auto size-8 text-red" />
								)}
							</td>
							<td className="px-4 py-3 text-center">
								{isConfigLimit ? (
									`${(feature as ConfigLimitComparison).ultimate} ${(feature as ConfigLimitComparison).suffix}`
								) : (feature as LevelingFeature).ultimate ? (
									<Check aria-label="Included" className="mx-auto size-8 text-[#93e19c]" />
								) : (
									<Close aria-label="Not included" className="mx-auto size-8 text-red" />
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Surface>
	);
}

interface ComparisonTableProps {
	section: string;
	features: LevelingFeature[] | ConfigLimitComparison[];
}
