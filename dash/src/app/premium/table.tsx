"use client";

import { Check, Xmark } from "@gravity-ui/icons";
import { Chip, Surface, Tabs } from "@heroui/react";
import clsx from "clsx";
import { useState } from "react";
import type { ConfigLimitComparison, LevelingFeature } from "@/app/premium/features.ts";
import { PremiumTier } from "@/lib/auth.ts";

export function ComparisonTable({ section, features }: ComparisonTableProps) {
	const [selectedTab, setSelectedTab] = useState<PremiumTier>(PremiumTier.Guild);
	const isConfigLimit = "suffix" in features[0]!;

	return (
		<div className="w-full max-w-7xl">
			<div className="mb-4 flex items-center gap-3">
				<Chip className="bg-white/10 font-medium" size="sm">
					{section}
				</Chip>
				<div className="h-px flex-1 bg-white/10" />
			</div>

			{/* Mobile tabs */}
			<div className="mb-4 md:hidden">
				<Tabs onSelectionChange={(key) => setSelectedTab(key as PremiumTier)} selectedKey={selectedTab}>
					<Tabs.ListContainer>
						<Tabs.List className="w-full">
							<Tabs.Tab className="flex-1" id={PremiumTier.None}>
								Free
							</Tabs.Tab>
							<Tabs.Tab className="flex-1" id={PremiumTier.Basic}>
								<span className="bg-gradient-to-r from-[#aad6c6] via-[#fa9079] to-[#74da9c] bg-clip-text text-transparent">
									Max
								</span>
							</Tabs.Tab>
							<Tabs.Tab className="flex-1" id={PremiumTier.Guild}>
								<span className="bg-gradient-to-r from-[#a2fbec] via-[#f985ff] to-[#4d54fe] bg-clip-text text-transparent">
									Ultimate
								</span>
							</Tabs.Tab>
						</Tabs.List>
					</Tabs.ListContainer>
				</Tabs>
			</div>

			<div className="relative">
				{/* Gradient glow behind Ultimate column - hidden on mobile */}
				<div className="pointer-events-none absolute top-0 right-0 -z-10 hidden h-full w-32 rounded-2xl bg-gradient-to-br from-[#a2fbec]/30 via-[#f985ff]/30 to-[#4d54fe]/30 opacity-50 blur-xl md:block" />

				{/* Gradient border overlay for Ultimate column - hidden on mobile */}
				<div className="pointer-events-none absolute top-0 right-0 z-10 hidden h-full w-32 rounded-2xl bg-[conic-gradient(from_180deg,#a2fbec,#f985ff,#4d54fe,#f985ff,#a2fbec)] p-px md:block">
					<div className="h-full w-full rounded-[15px] bg-darker" />
				</div>

				<Surface className="overflow-hidden rounded-2xl">
					<table aria-label={`${section} comparison table`} className="w-full border-separate border-spacing-0">
						<thead>
							<tr>
								<th className="w-1/2 border-white/10 border-b bg-white/5 px-4 py-4 text-left font-medium text-sm text-white/60 uppercase tracking-wider md:w-auto md:px-6">
									Feature
								</th>
								{/* Mobile: show selected tab column */}
								<th className="w-1/2 border-white/10 border-b bg-white/5 px-3 py-4 text-right font-medium text-sm uppercase tracking-wider md:hidden">
									{selectedTab === PremiumTier.None && <span className="text-white/60">Free</span>}
									{selectedTab === PremiumTier.Basic && (
										<span className="bg-gradient-to-r from-[#aad6c6] via-[#fa9079] to-[#74da9c] bg-clip-text text-transparent">
											Max
										</span>
									)}
									{selectedTab === PremiumTier.Guild && (
										<span className="bg-gradient-to-r from-[#a2fbec] via-[#f985ff] to-[#4d54fe] bg-clip-text text-transparent">
											Ultimate
										</span>
									)}
								</th>
								{/* Desktop: show all columns */}
								<th className="hidden w-32 border-white/10 border-b bg-white/5 px-4 py-4 text-center font-medium text-sm text-white/60 uppercase tracking-wider md:table-cell">
									Free
								</th>
								<th className="hidden w-32 border-white/10 border-b bg-white/5 px-4 py-4 text-center font-medium text-sm uppercase tracking-wider md:table-cell">
									<span className="bg-gradient-to-r from-[#aad6c6] via-[#fa9079] to-[#74da9c] bg-clip-text text-transparent">
										Max
									</span>
								</th>
								<th className="relative z-20 hidden w-32 border-white/10 border-b bg-white/5 px-4 py-4 text-center font-medium text-sm uppercase tracking-wider md:table-cell">
									<span className="bg-gradient-to-r from-[#a2fbec] via-[#f985ff] to-[#4d54fe] bg-clip-text text-transparent">
										Ultimate
									</span>
								</th>
							</tr>
						</thead>

						<tbody>
							{features.map((feature, index) => (
								<tr className="transition-colors hover:bg-white/5" key={feature.name}>
									<td
										className={clsx(
											"w-1/2 border-white/5 border-b px-4 py-4 text-sm text-white/80 md:w-auto md:px-6",
											index % 2 !== 0 && "bg-white/[0.02]",
										)}
									>
										{feature.name}
									</td>

									{/* Mobile: show selected tab value */}
									<td
										className={clsx(
											"w-1/2 border-white/5 border-b px-3 py-4 text-right md:hidden",
											index % 2 !== 0 && "bg-white/[0.02]",
										)}
									>
										<MobileCell feature={feature} isConfigLimit={isConfigLimit} selectedTab={selectedTab} />
									</td>

									{/* Desktop: show all columns */}
									<td
										className={clsx(
											"hidden border-white/5 border-b px-4 py-4 text-center md:table-cell",
											index % 2 !== 0 && "bg-white/[0.02]",
										)}
									>
										<FreeCell feature={feature} isConfigLimit={isConfigLimit} />
									</td>
									<td
										className={clsx(
											"hidden border-white/5 border-b px-4 py-4 text-center md:table-cell",
											index % 2 !== 0 && "bg-white/[0.02]",
										)}
									>
										<MaxCell feature={feature} isConfigLimit={isConfigLimit} />
									</td>
									<td
										className={clsx(
											"relative z-20 hidden border-white/5 border-b px-4 py-4 text-center md:table-cell",
											index % 2 !== 0 && "bg-white/[0.02]",
										)}
									>
										<UltimateCell feature={feature} isConfigLimit={isConfigLimit} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Surface>
			</div>
		</div>
	);
}

function MobileCell({
	feature,
	isConfigLimit,
	selectedTab,
}: {
	feature: ConfigLimitComparison | LevelingFeature;
	isConfigLimit: boolean;
	selectedTab: PremiumTier;
}) {
	const content = (() => {
		if (selectedTab === PremiumTier.None) {
			return <FreeCell feature={feature} isConfigLimit={isConfigLimit} />;
		}
		if (selectedTab === PremiumTier.Basic) {
			return <MaxCell feature={feature} isConfigLimit={isConfigLimit} />;
		}
		return <UltimateCell feature={feature} isConfigLimit={isConfigLimit} />;
	})();

	return <div className="flex justify-end">{content}</div>;
}

function FreeCell({
	feature,
	isConfigLimit,
}: {
	feature: ConfigLimitComparison | LevelingFeature;
	isConfigLimit: boolean;
}) {
	if (isConfigLimit) {
		return (
			<span className="text-sm text-white/60">
				{(feature as ConfigLimitComparison).free}{" "}
				<span className="text-white/40">{(feature as ConfigLimitComparison).suffix}</span>
			</span>
		);
	}
	return feature.free ? (
		<div className="flex justify-center">
			<div className="flex size-6 items-center justify-center rounded-full bg-[#93e19c]/20">
				<Check aria-label="Included" className="size-4 text-[#93e19c]" />
			</div>
		</div>
	) : (
		<div className="flex justify-center">
			<div className="flex size-6 items-center justify-center rounded-full bg-white/10">
				<Xmark aria-label="Not included" className="size-4 text-white/30" />
			</div>
		</div>
	);
}

function MaxCell({
	feature,
	isConfigLimit,
}: {
	feature: ConfigLimitComparison | LevelingFeature;
	isConfigLimit: boolean;
}) {
	if (isConfigLimit) {
		return (
			<span className="text-sm text-white/60">
				{(feature as ConfigLimitComparison).max ?? (feature as ConfigLimitComparison).free}{" "}
				<span className="text-white/40">{(feature as ConfigLimitComparison).suffix}</span>
			</span>
		);
	}
	return (feature as LevelingFeature).max ? (
		<div className="flex justify-center">
			<div className="flex size-6 items-center justify-center rounded-full bg-[#93e19c]/20">
				<Check aria-label="Included" className="size-4 text-[#93e19c]" />
			</div>
		</div>
	) : (
		<div className="flex justify-center">
			<div className="flex size-6 items-center justify-center rounded-full bg-white/10">
				<Xmark aria-label="Not included" className="size-4 text-white/30" />
			</div>
		</div>
	);
}

function UltimateCell({
	feature,
	isConfigLimit,
}: {
	feature: ConfigLimitComparison | LevelingFeature;
	isConfigLimit: boolean;
}) {
	if (isConfigLimit) {
		return (
			<span className="font-medium text-sm text-white/80">
				{(feature as ConfigLimitComparison).ultimate}{" "}
				<span className="text-white/40">{(feature as ConfigLimitComparison).suffix}</span>
			</span>
		);
	}
	return (feature as LevelingFeature).ultimate ? (
		<div className="flex justify-center">
			<div className="flex size-6 items-center justify-center rounded-full bg-[#93e19c]/20">
				<Check aria-label="Included" className="size-4 text-[#93e19c]" />
			</div>
		</div>
	) : (
		<div className="flex justify-center">
			<div className="flex size-6 items-center justify-center rounded-full bg-white/10">
				<Xmark aria-label="Not included" className="size-4 text-white/30" />
			</div>
		</div>
	);
}

interface ComparisonTableProps {
	section: string;
	features: LevelingFeature[] | ConfigLimitComparison[];
}
