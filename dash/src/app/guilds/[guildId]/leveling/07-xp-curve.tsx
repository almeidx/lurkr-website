"use client";

import { useCallback, useMemo, useState } from "react";
import {
	Area,
	CartesianGrid,
	ComposedChart,
	Line,
	ResponsiveContainer,
	Tooltip,
	type TooltipContentProps,
	XAxis,
	YAxis,
} from "recharts";
import { Input } from "@/components/dashboard/Input.tsx";
import { Label } from "@/components/dashboard/Label.tsx";
import {
	MAX_XP_CURVE_COEFFICIENTS,
	MIN_XP_CURVE_COEFFICIENTS,
	XP_CURVE_PRESETS,
	type XpCurvePresetName,
} from "@/lib/guild-config.ts";
import { validateXpCurve } from "@/lib/validate-xp-curve.ts";
import { formatNumber } from "@/utils/format-number.ts";

const COEFFICIENT_LABELS = ["Constant (c₀)", "Linear (c₁·n)", "Quadratic (c₂·n²)", "Cubic (c₃·n³)", "Quartic (c₄·n⁴)"];
const SAMPLE_LEVELS = [1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

const PRESET_COLORS: Record<XpCurvePresetName, string> = {
	amari: "#f59e0b",
	lurkr: "#22c55e",
	mee6: "#a855f7",
};

const PRESET_LABELS: Record<XpCurvePresetName, string> = {
	amari: "Amari",
	lurkr: "Lurkr",
	mee6: "MEE6",
};

const PRESET_NAMES = Object.keys(XP_CURVE_PRESETS) as XpCurvePresetName[];

const PRESET_OPTIONS = [
	{ description: "50n² − 100n + 150", label: "Lurkr (Default)", value: "lurkr" as const },
	{ description: "20n² − 40n + 55", label: "Amari", value: "amari" as const },
	{ description: "≈1.67n³ + 22.5n² + 75.83n", label: "MEE6", value: "mee6" as const },
	{ description: "Define your own polynomial curve", label: "Custom", value: "custom" as const },
] as const;

function getRequiredXp(level: number, xpCurve: readonly number[]): number {
	if (level <= 0) return 0;
	const xp = xpCurve.reduce((sum, coeff, exp) => sum + coeff * level ** exp, 0);
	return Math.max(0, Math.round(xp));
}

function detectPreset(coefficients: readonly number[]): XpCurvePresetName | "custom" {
	for (const [name, preset] of Object.entries(XP_CURVE_PRESETS)) {
		if (coefficients.length !== preset.length) continue;
		if (coefficients.every((coeff, i) => Math.abs(coeff - preset[i]!) < 0.0001)) {
			return name as XpCurvePresetName;
		}
	}
	return "custom";
}

export function XpCurve({ defaultValue }: XpCurveProps) {
	const initialPreset = detectPreset(defaultValue);
	const [selectedPreset, setSelectedPreset] = useState<XpCurvePresetName | "custom">(initialPreset);
	const [coefficients, setCoefficients] = useState<number[]>([...defaultValue]);

	const activeCoefficients = useMemo(
		() => (selectedPreset === "custom" ? coefficients : [...XP_CURVE_PRESETS[selectedPreset]]),
		[selectedPreset, coefficients],
	);

	const validationError = useMemo(() => {
		const result = validateXpCurve(activeCoefficients);
		return result.valid ? null : (result.error ?? "Invalid XP curve");
	}, [activeCoefficients]);

	const [showComparison, setShowComparison] = useState(false);

	const chartData = useMemo(
		() =>
			SAMPLE_LEVELS.map((level) => {
				const point: Record<string, number> = {
					active: validationError ? 0 : getRequiredXp(level, activeCoefficients),
					level,
				};
				if (showComparison) {
					for (const name of PRESET_NAMES) {
						point[name] = getRequiredXp(level, XP_CURVE_PRESETS[name]);
					}
				}
				return point;
			}),
		[activeCoefficients, validationError, showComparison],
	);

	const handlePresetChange = useCallback((preset: XpCurvePresetName | "custom") => {
		setSelectedPreset(preset);
		if (preset !== "custom") {
			setCoefficients([...XP_CURVE_PRESETS[preset]]);
		}
	}, []);

	const handleCoefficientChange = useCallback((index: number, value: string) => {
		const num = value === "" || value === "-" ? 0 : Number.parseFloat(value);
		setCoefficients((prev) => {
			const next = [...prev];
			if (index >= next.length) {
				while (next.length <= index) next.push(0);
			}
			next[index] = Number.isNaN(num) ? 0 : num;
			while (next.length > MIN_XP_CURVE_COEFFICIENTS && next.at(-1) === 0) next.pop();
			return next;
		});
		setSelectedPreset("custom");
	}, []);

	return (
		<div className="flex flex-col gap-6">
			<input name="xpCurve" type="hidden" value={JSON.stringify(activeCoefficients)} />

			<div className="flex flex-col gap-3">
				<Label>Select a preset or customize the XP curve…</Label>

				<div className="flex flex-wrap gap-2">
					{PRESET_OPTIONS.map((option) => (
						<button
							className={`flex flex-col gap-0.5 rounded-lg border px-4 py-2.5 text-left transition-colors ${
								selectedPreset === option.value
									? "border-[#0072f5] bg-[#0072f5]/10"
									: "border-white/15 bg-light-gray hover:border-white/30"
							}`}
							key={option.value}
							onClick={() => handlePresetChange(option.value)}
							type="button"
						>
							<span className="font-medium text-sm text-white">{option.label}</span>
							<span className="text-white/50 text-xs">{option.description}</span>
						</button>
					))}
				</div>
			</div>

			{selectedPreset === "custom" && (
				<div className="flex flex-col gap-3">
					<Label sub={`${MIN_XP_CURVE_COEFFICIENTS}-${MAX_XP_CURVE_COEFFICIENTS} coefficients`}>
						Polynomial coefficients
					</Label>

					<div className="flex flex-wrap gap-3">
						{COEFFICIENT_LABELS.map((label, index) => (
							<div className="flex flex-col gap-1" key={label}>
								<span className="text-white/50 text-xs">{label}</span>
								<Input
									className="w-28 min-w-0!"
									defaultValue={coefficients[index] ?? ""}
									id={`xpCurveCoeff${index}`}
									onChange={(e) => handleCoefficientChange(index, e.target.value)}
									placeholder="0"
									step="any"
									type="number"
								/>
							</div>
						))}
					</div>

					{validationError && <p className="text-red-400 text-sm">{validationError}</p>}
				</div>
			)}

			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<Label small>XP required per level</Label>

					<button
						className={`rounded-md border px-3 py-1 text-xs transition-colors ${
							showComparison
								? "border-white/25 bg-white/10 text-white"
								: "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
						}`}
						onClick={() => setShowComparison((prev) => !prev)}
						type="button"
					>
						{showComparison ? "Hide" : "Compare"} presets
					</button>
				</div>

				<ResponsiveContainer className="rounded-2.5xl bg-black/30" height={280} width="100%">
					<ComposedChart data={chartData} margin={{ bottom: 20, left: 50, right: 20, top: 20 }}>
						<defs>
							<linearGradient id="xpGradient" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0%" stopColor="#0072f5" stopOpacity={0.3} />
								<stop offset="100%" stopColor="#0072f5" stopOpacity={0} />
							</linearGradient>
						</defs>

						<CartesianGrid stroke="#2c2c2c" strokeDasharray="3 3" strokeOpacity={0.5} vertical={false} />

						<XAxis
							axisLine={{ stroke: "#666" }}
							dataKey="level"
							label={{ fill: "#888", offset: -10, position: "insideBottom", value: "Level" }}
							stroke="#666"
							tick={{ fill: "#888", fontSize: 11 }}
							tickLine={{ stroke: "#666" }}
						/>
						<YAxis
							axisLine={{ stroke: "#666" }}
							stroke="#666"
							tick={{ fill: "#888", fontSize: 11 }}
							tickFormatter={(value) => formatNumber(value)}
							tickLine={{ stroke: "#666" }}
							width={60}
						/>

						<Tooltip
							content={(props) => <XpCurveTooltip {...props} showComparison={showComparison} />}
							cursor={{ stroke: "rgba(255, 255, 255, 0.2)" }}
						/>

						{showComparison &&
							PRESET_NAMES.map((name) => (
								<Line
									dataKey={name}
									dot={false}
									key={name}
									stroke={PRESET_COLORS[name]}
									strokeDasharray="6 3"
									strokeOpacity={0.4}
									strokeWidth={1.5}
									type="monotone"
								/>
							))}

						<Area dataKey="active" fill="url(#xpGradient)" stroke="#0072f5" strokeWidth={2} type="monotone" />
					</ComposedChart>
				</ResponsiveContainer>

				{showComparison && (
					<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
						<span className="flex items-center gap-1.5">
							<span className="inline-block h-0.5 w-4 rounded bg-[#0072f5]" />
							<span className="text-white/60">Active</span>
						</span>
						{PRESET_NAMES.map((name) => (
							<span className="flex items-center gap-1.5" key={name}>
								<span
									className="inline-block h-0.5 w-4 rounded opacity-50"
									style={{ background: PRESET_COLORS[name], borderStyle: "dashed" }}
								/>
								<span className="text-white/40">{PRESET_LABELS[name]}</span>
							</span>
						))}
					</div>
				)}
			</div>

			<div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
				<span>Level 1: {formatNumber(getRequiredXp(1, activeCoefficients))} XP</span>
				<span>Level 10: {formatNumber(getRequiredXp(10, activeCoefficients))} XP</span>
				<span>Level 50: {formatNumber(getRequiredXp(50, activeCoefficients))} XP</span>
				<span>Level 100: {formatNumber(getRequiredXp(100, activeCoefficients))} XP</span>
			</div>
		</div>
	);
}

function XpCurveTooltip({ active, payload, showComparison }: TooltipContentProps & { showComparison: boolean }) {
	if (!active || !payload?.length) return null;
	const data = payload[0]!.payload;
	return (
		<div className="flex flex-col gap-1 rounded-md border border-[#555] bg-[#333] p-2">
			<p className="mb-0.5 text-white/50 text-xs">Level {data.level}</p>
			<p className="text-sm text-white">
				<span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[#0072f5]" />
				{formatNumber(data.active)} XP
			</p>
			{showComparison &&
				PRESET_NAMES.map((name) => (
					<p className="text-white/50 text-xs" key={name}>
						<span
							className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full"
							style={{ background: PRESET_COLORS[name] }}
						/>
						{PRESET_LABELS[name]}: {formatNumber(data[name])} XP
					</p>
				))}
		</div>
	);
}

interface XpCurveProps {
	readonly defaultValue: number[];
}
