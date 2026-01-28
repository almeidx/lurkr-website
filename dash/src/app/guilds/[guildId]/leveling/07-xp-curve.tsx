"use client";

import {
	Select,
	SelectArrow,
	SelectItem,
	SelectLabel,
	SelectPopover,
	useSelectStore,
	useStoreState,
} from "@ariakit/react";
import { ChevronDown, ChevronUp, CircleExclamationFill } from "@gravity-ui/icons";
import { useEffect, useMemo, useState } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	type TooltipContentProps,
	XAxis,
	YAxis,
} from "recharts";
import { DocsBubble } from "@/components/dashboard/DocsBubble.tsx";
import { Input } from "@/components/dashboard/Input.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import { AddComment } from "@/components/icons/mdi/add-comment.tsx";
import { Delete } from "@/components/icons/mdi/delete.tsx";
import {
	DEFAULT_XP_CURVE,
	MAX_XP_CURVE_COEFFICIENTS,
	MIN_XP_CURVE_COEFFICIENTS,
	XP_CURVE_PRESETS,
} from "@/lib/guild-config.ts";
import { formatNumber } from "@/utils/format-number.ts";

type PresetKey = keyof typeof XP_CURVE_PRESETS | "custom";

const PRESET_OPTIONS: { label: string; value: PresetKey }[] = [
	{ label: "Lurkr (Default)", value: "lurkr" },
	{ label: "MEE6", value: "mee6" },
	{ label: "Amari", value: "amari" },
	{ label: "Custom", value: "custom" },
];

const CHART_COLORS = {
	amari: "#FFE99C",
	custom: "#93e19c",
	lurkr: "#ff7077",
	mee6: "#5FD1F6",
} as const;

const SAMPLE_LEVELS = [0, 1, 2, 5, 10, 25, 50, 100, 250, 500, 750, 1000];

/**
 * Calculate required XP for a level using polynomial coefficients
 */
function getRequiredXp(level: number, coefficients: readonly number[]): number {
	if (level <= 0) return 0;
	return Math.round(coefficients.reduce((sum, coeff, exp) => sum + coeff * level ** exp, 0));
}

/**
 * Calculate approximate messages needed to reach a level (from level 0)
 */
function getApproxMessages(level: number, coefficients: readonly number[], avgXpPerMessage: number): number {
	const xp = getRequiredXp(level, coefficients);
	return Math.ceil(xp / avgXpPerMessage);
}

/**
 * Validates that an XP curve is monotonically increasing
 */
function validateXpCurve(coefficients: readonly number[]): { valid: boolean; error?: string } {
	if (coefficients.length < MIN_XP_CURVE_COEFFICIENTS || coefficients.length > MAX_XP_CURVE_COEFFICIENTS) {
		return {
			error: `Number of coefficients must be between ${MIN_XP_CURVE_COEFFICIENTS} and ${MAX_XP_CURVE_COEFFICIENTS}`,
			valid: false,
		};
	}

	// Check that all coefficients are finite numbers and not all are zero
	let hasNonZero = false;
	for (let i = 0; i < coefficients.length; i++) {
		const coeff = coefficients[i]!;
		if (!Number.isFinite(coeff)) {
			return {
				error: `Coefficient at index ${i} is not a finite number.`,
				valid: false,
			};
		}

		if (coeff !== 0) {
			hasNonZero = true;
		}
	}

	if (!hasNonZero) {
		return {
			error: "All coefficients cannot be zero. At least one non-zero coefficient is required.",
			valid: false,
		};
	}

	// Validate that the curve is monotonically increasing
	let previousRawXp = 0;
	let previousLevel = 0;

	for (const level of SAMPLE_LEVELS) {
		const rawXp = level <= 0 ? 0 : Math.round(coefficients.reduce((sum, coeff, exp) => sum + coeff * level ** exp, 0));

		if (rawXp < 0) {
			return {
				error: `XP cannot be negative. At level ${level}, XP would be ${rawXp}.`,
				valid: false,
			};
		}

		// For levels > 0, XP must strictly increase (no flat regions)
		if (level > 0 && rawXp <= previousRawXp) {
			return {
				error: `XP must strictly increase with each level. Level ${level} requires ${rawXp} XP, same as or less than level ${previousLevel} (${previousRawXp} XP).`,
				valid: false,
			};
		}

		previousRawXp = rawXp;
		previousLevel = level;

		// Check derivative to ensure the curve is increasing
		if (level > 0) {
			const derivative = coefficients.slice(1).reduce((sum, coeff, exp) => {
				const power = exp + 1;
				return sum + power * coeff * level ** exp;
			}, 0);

			if (derivative < 0) {
				return {
					error: `The curve decreases at level ${level}. XP must increase with each level.`,
					valid: false,
				};
			}
		}
	}

	return { valid: true };
}

/**
 * Determine which preset matches the given coefficients
 */
function getMatchingPreset(coefficients: readonly number[]): PresetKey {
	for (const [key, preset] of Object.entries(XP_CURVE_PRESETS)) {
		if (coefficients.length === preset.length && coefficients.every((c, i) => Math.abs(c - preset[i]!) < 0.0001)) {
			return key as PresetKey;
		}
	}
	return "custom";
}

/**
 * Generate chart data for levels 1-100
 */
function generateChartData(customCoefficients: readonly number[]) {
	const levels = Array.from({ length: 100 }, (_, i) => i + 1);
	return levels.map((level) => ({
		amari: getRequiredXp(level, XP_CURVE_PRESETS.amari),
		custom: getRequiredXp(level, customCoefficients),
		level,
		lurkr: getRequiredXp(level, XP_CURVE_PRESETS.lurkr),
		mee6: getRequiredXp(level, XP_CURVE_PRESETS.mee6),
	}));
}

function CustomTooltip({ active, payload, label }: TooltipContentProps<number, string>) {
	if (active && payload && payload.length) {
		return (
			<div className="rounded-md border border-[#555] bg-[#333] p-3">
				<p className="mb-2 font-medium text-white">Level {label}</p>
				{payload.map((entry, index) => (
					<p className="text-sm" key={entry.dataKey ?? index} style={{ color: entry.color }}>
						{entry.name}: {formatNumber(entry.value as number)} XP
					</p>
				))}
			</div>
		);
	}
	return null;
}

export function XpCurve({ defaultValue, xpPerMessageMin, xpPerMessageMax }: XpCurveProps) {
	const initialPreset = getMatchingPreset(defaultValue);
	const [selectedPreset, setSelectedPreset] = useState<PresetKey>(initialPreset);
	const [customCoefficients, setCustomCoefficients] = useState<number[]>(
		initialPreset === "custom" ? [...defaultValue] : [...DEFAULT_XP_CURVE],
	);
	const [showChart, setShowChart] = useState(false);
	const [showCoefficients, setShowCoefficients] = useState(false);

	const avgXpPerMessage = (xpPerMessageMin + xpPerMessageMax) / 2;

	const select = useSelectStore({
		defaultValue: initialPreset,
		setValue: (value) => {
			const preset = value as PresetKey;
			setSelectedPreset(preset);
			if (preset !== "custom") {
				setCustomCoefficients([...XP_CURVE_PRESETS[preset]]);
			}
		},
	});
	const selectValue = useStoreState(select, "value");

	// The actual coefficients being used (either from preset or custom)
	const activeCoefficients = useMemo(() => {
		if (selectedPreset === "custom") {
			return customCoefficients;
		}
		return [...XP_CURVE_PRESETS[selectedPreset]];
	}, [selectedPreset, customCoefficients]);

	// Validation
	const validation = useMemo(() => validateXpCurve(activeCoefficients), [activeCoefficients]);

	// Chart data
	const chartData = useMemo(() => generateChartData(activeCoefficients), [activeCoefficients]);

	// Sync with default value changes
	useEffect(() => {
		const preset = getMatchingPreset(defaultValue);
		setSelectedPreset(preset);
		if (preset === "custom") {
			setCustomCoefficients([...defaultValue]);
		}
	}, [defaultValue]);

	function handleCoefficientChange(index: number, value: string) {
		const numValue = value === "" || value === "-" ? 0 : Number.parseFloat(value);
		setCustomCoefficients((prev) => {
			const next = [...prev];
			next[index] = Number.isNaN(numValue) ? 0 : numValue;
			return next;
		});
		setSelectedPreset("custom");
		select.setValue("custom");
	}

	function handleAddCoefficient() {
		if (customCoefficients.length < MAX_XP_CURVE_COEFFICIENTS) {
			setCustomCoefficients((prev) => [...prev, 0]);
			setSelectedPreset("custom");
			select.setValue("custom");
		}
	}

	function handleRemoveCoefficient(index: number) {
		if (customCoefficients.length > MIN_XP_CURVE_COEFFICIENTS) {
			setCustomCoefficients((prev) => prev.filter((_, i) => i !== index));
			setSelectedPreset("custom");
			select.setValue("custom");
		}
	}

	const selectedOption = PRESET_OPTIONS.find((opt) => opt.value === selectValue);

	return (
		<div className="flex flex-col gap-4">
			{/* Hidden input for form submission */}
			<input name="xpCurve" type="hidden" value={JSON.stringify(activeCoefficients)} />

			<div className="flex items-center">
				<SelectLabel className="text-lg text-white/75 tracking-tight md:text-xl" store={select}>
					Choose an XP curve formula for leveling progression…
				</SelectLabel>

				<DocsBubble
					path="/guides/leveling-automation#xp-curve"
					tooltip="The XP curve determines how much experience is required to reach each level. Different curves create different progression speeds."
				/>
			</div>

			{/* Preset selector */}
			<div className="flex flex-col gap-2">
				<Label>Preset</Label>
				<Select
					className="flex h-10 w-full max-w-xs items-center justify-between rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
					store={select}
				>
					{selectedOption ? <span className="font-medium text-white">{selectedOption.label}</span> : "Select preset"}
					<SelectArrow />
				</Select>

				<SelectPopover
					className="z-10000 flex max-h-64 w-full flex-col gap-2 overflow-y-auto rounded-lg bg-light-gray px-3 py-2 shadow-dim-inner"
					gutter={8}
					sameWidth
					store={select}
				>
					{PRESET_OPTIONS.map(({ value, label }) => (
						<SelectItem
							className="flex cursor-default items-center rounded-lg p-2 text-lg text-white/75 tracking-tight hover:bg-white/5 data-active-item:bg-white/10 data-active-item:text-white"
							key={value}
							store={select}
							value={value}
						>
							<span className="font-medium text-white">{label}</span>
						</SelectItem>
					))}
				</SelectPopover>
			</div>

			{/* XP & Messages preview */}
			<div className="flex flex-col gap-2">
				<Label sub={`Based on ${xpPerMessageMin}-${xpPerMessageMax} XP per message`}>Progression Preview</Label>
				<div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
					{[5, 10, 25, 50, 100].map((level) => (
						<div className="flex gap-2" key={level}>
							<span className="text-white/50">Lvl {level}:</span>
							<span className="font-medium text-white">
								{formatNumber(getRequiredXp(level, activeCoefficients))} XP
							</span>
							<span className="text-white/40">
								({formatNumber(getApproxMessages(level, activeCoefficients, avgXpPerMessage))} msgs)
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Coefficients toggle and content */}
			<div className="flex flex-col gap-3">
				<button
					className="flex w-fit items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/75 transition-colors hover:bg-white/10"
					onClick={() => setShowCoefficients(!showCoefficients)}
					type="button"
				>
					{showCoefficients ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
					{showCoefficients ? "Hide" : "Show"} Custom Coefficients
				</button>

				{showCoefficients && (
					<div className="flex max-w-md flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-4">
						<div className="flex items-center justify-between">
							<Label sub={`${MIN_XP_CURVE_COEFFICIENTS}-${MAX_XP_CURVE_COEFFICIENTS} coefficients`}>Coefficients</Label>
							{customCoefficients.length < MAX_XP_CURVE_COEFFICIENTS && (
								<button
									className="rounded-lg bg-green p-1 transition-colors hover:bg-green/75"
									onClick={handleAddCoefficient}
									type="button"
								>
									<AddComment className="size-5 text-white" />
								</button>
							)}
						</div>

						<div className="flex flex-col gap-2">
							{customCoefficients.map((coeff, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: Index represents the polynomial exponent (n⁰, n¹, n², etc.) and is semantically meaningful
								<div className="flex items-center gap-2" key={index}>
									<span className="w-8 text-sm text-white/50">n{index > 0 ? <sup>{index}</sup> : "⁰"}</span>
									<Input
										className="flex-1"
										id={`xpCurve-coeff-${index}`}
										onChange={(e) => handleCoefficientChange(index, e.target.value)}
										placeholder="0"
										step="any"
										type="number"
										value={coeff === 0 ? "" : coeff.toString()}
									/>
									{customCoefficients.length > MIN_XP_CURVE_COEFFICIENTS && (
										<button
											className="rounded-lg bg-[#ed4245]/20 p-1.5 transition-colors hover:bg-[#ed4245]/40"
											onClick={() => handleRemoveCoefficient(index)}
											type="button"
										>
											<Delete className="size-4 text-[#ed4245]" />
										</button>
									)}
								</div>
							))}
						</div>

						<p className="text-white/50 text-xs">Formula: c₀ + c₁n + c₂n² + c₃n³ + ... where n = level</p>
					</div>
				)}
			</div>

			{/* Validation error */}
			{!validation.valid && (
				<div className="flex items-start gap-2 rounded-lg border border-[#ed4245]/50 bg-[#ed4245]/10 p-3">
					<CircleExclamationFill className="mt-0.5 size-4 shrink-0 text-[#ed4245]" />
					<p className="text-[#ed4245] text-sm">{validation.error}</p>
				</div>
			)}

			{/* Chart toggle and content */}
			<div className="flex flex-col gap-3">
				<button
					className="flex w-fit items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/75 transition-colors hover:bg-white/10"
					onClick={() => setShowChart(!showChart)}
					type="button"
				>
					{showChart ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
					{showChart ? "Hide" : "Show"} XP Curve Comparison Chart
				</button>

				{showChart && (
					<div className="rounded-lg border border-white/10 bg-black/20 p-4">
						<Label>XP Curve Comparison</Label>
						<div className="mt-2 h-80 w-full rounded-lg bg-black/30 p-4">
							<ResponsiveContainer height="100%" width="100%">
								<LineChart data={chartData} margin={{ bottom: 5, left: 10, right: 30, top: 5 }}>
									<CartesianGrid stroke="#2c2c2c" strokeDasharray="3 3" strokeOpacity={0.5} vertical={false} />
									<XAxis
										axisLine={{ stroke: "#666" }}
										dataKey="level"
										label={{ fill: "#888", offset: -5, position: "insideBottom", value: "Level" }}
										stroke="#666"
										tick={{ fill: "#888", fontSize: 11 }}
										tickLine={{ stroke: "#666" }}
									/>
									<YAxis
										axisLine={{ stroke: "#666" }}
										label={{ angle: -90, fill: "#888", position: "insideLeft", value: "XP Required" }}
										stroke="#666"
										tick={{ fill: "#888", fontSize: 11 }}
										tickFormatter={(value) => formatNumber(value)}
										tickLine={{ stroke: "#666" }}
									/>
									<Tooltip content={CustomTooltip} />
									<Legend />

									{/* Reference lines for presets */}
									<Line
										dataKey="lurkr"
										dot={false}
										name="Lurkr"
										stroke={CHART_COLORS.lurkr}
										strokeDasharray={selectedPreset === "lurkr" ? undefined : "5 5"}
										strokeOpacity={selectedPreset === "lurkr" ? 1 : 0.5}
										strokeWidth={selectedPreset === "lurkr" ? 3 : 1.5}
										type="monotone"
									/>
									<Line
										dataKey="mee6"
										dot={false}
										name="MEE6"
										stroke={CHART_COLORS.mee6}
										strokeDasharray={selectedPreset === "mee6" ? undefined : "5 5"}
										strokeOpacity={selectedPreset === "mee6" ? 1 : 0.5}
										strokeWidth={selectedPreset === "mee6" ? 3 : 1.5}
										type="monotone"
									/>
									<Line
										dataKey="amari"
										dot={false}
										name="Amari"
										stroke={CHART_COLORS.amari}
										strokeDasharray={selectedPreset === "amari" ? undefined : "5 5"}
										strokeOpacity={selectedPreset === "amari" ? 1 : 0.5}
										strokeWidth={selectedPreset === "amari" ? 3 : 1.5}
										type="monotone"
									/>

									{/* Custom curve (only show if different from presets) */}
									{selectedPreset === "custom" && (
										<Line
											dataKey="custom"
											dot={false}
											name="Custom"
											stroke={CHART_COLORS.custom}
											strokeWidth={3}
											type="monotone"
										/>
									)}
								</LineChart>
							</ResponsiveContainer>
						</div>
						<p className="mt-2 text-white/50 text-xs">
							The chart shows XP required to reach each level (1-100). Higher curves mean slower progression.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

interface XpCurveProps {
	readonly defaultValue: number[];
	readonly xpPerMessageMin: number;
	readonly xpPerMessageMax: number;
}
