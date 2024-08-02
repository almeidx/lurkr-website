"use client";

import { formatNumber } from "@/utils/format-number.ts";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { TooltipWithBounds, defaultStyles, useTooltip } from "@visx/tooltip";

const verticalMargin = 30;
const horizontalMargin = 50;

function getLabel(d: GetMyMonthlyProgressResponse[number]) {
	return d.date.split("-").slice(1).join("-");
}
function getValue(d: GetMyMonthlyProgressResponse[number]) {
	return d.updateCount;
}

export function MessageCounts({ width, height, data }: BarsProps) {
	const xMax = width - horizontalMargin;
	const yMax = height - verticalMargin * 2;

	const xScale = scaleBand({
		range: [0, xMax],
		round: true,
		domain: data.map(getLabel),
		padding: 0.5,
	});

	const yScale = scaleLinear({
		range: [yMax, 0],
		round: true,
		domain: [0, Math.max(...data.map(getValue)) * 1.1],
		nice: true,
	});

	const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip<{
		date: string;
		updateCount: number;
	}>();

	return (
		<>
			<svg width={width} height={height}>
				<rect width={width} height={height} fill="#141414" rx={14} />
				<Group left={horizontalMargin} top={verticalMargin}>
					<GridRows scale={yScale} width={xMax} height={yMax} stroke="#2c2c2c" strokeOpacity={0.5} />

					{data.map((d) => {
						const date = getLabel(d);
						const barWidth = xScale.bandwidth();
						const barHeight = yMax - (yScale(getValue(d)) ?? 0);
						const barX = xScale(date);
						const barY = yMax - barHeight;
						return (
							<Bar
								key={`bar-${date}`}
								x={barX}
								y={barY}
								width={barWidth}
								height={barHeight}
								fill="#0072f5"
								onMouseLeave={() => hideTooltip()}
								onMouseMove={(event) => {
									const top = event.clientY - verticalMargin + 30;
									const left = event.clientX - horizontalMargin + 50;
									showTooltip({ tooltipData: d, tooltipTop: top, tooltipLeft: left });
								}}
							/>
						);
					})}

					<AxisLeft
						scale={yScale}
						tickStroke="#666"
						tickFormat={(value) => formatNumber(value as number)}
						tickLabelProps={() => ({
							fill: "#888",
							fontSize: 11,
							textAnchor: "end",
							dy: "0.33em",
						})}
						numTicks={5}
					/>

					<AxisBottom
						top={yMax}
						scale={xScale}
						tickStroke="#666"
						tickLabelProps={() => ({
							fill: "#888",
							fontSize: 11,
							textAnchor: "middle",
						})}
						numTicks={8}
					/>
				</Group>
			</svg>
			{tooltipOpen && tooltipData && (
				// @ts-expect-error: React version mismatch
				<TooltipWithBounds
					top={tooltipTop}
					left={tooltipLeft}
					style={{
						...defaultStyles,
						background: "#333",
						padding: "0.5rem",
						border: "1px solid #555",
					}}
				>
					<p className="text-[#fff]">
						<span className="text-white">Date:</span> <time>{tooltipData.date}</time>
					</p>
					<p className="text-[#fff]">
						<span className="text-white">Message count:</span> {tooltipData.updateCount}
					</p>
				</TooltipWithBounds>
			)}
		</>
	);
}

export interface BarsProps {
	width: number;
	height: number;
	events?: boolean;
	data: GetMyMonthlyProgressResponse;
}

export type GetMyMonthlyProgressResponse = {
	date: `${number}-${number}-${number}`;
	value: number;
	updateCount: number;
}[];
