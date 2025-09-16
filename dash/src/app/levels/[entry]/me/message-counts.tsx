"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	type TooltipContentProps,
	XAxis,
	YAxis,
} from "recharts";
import { formatNumber } from "@/utils/format-number.ts";

const verticalMargin = 30;
const horizontalMargin = 50;

export function MessageCounts({ data }: BarsProps) {
	const formattedData = data.map((item) => ({
		...item,
		// Remove the year from the date
		formattedDate: item.date.split("-").slice(1).join("-"),
	}));

	return (
		<ResponsiveContainer className="max-h-96 w-full rounded-2.5xl bg-black/30" height="100%" width="100%">
			<BarChart
				data={formattedData}
				margin={{ bottom: verticalMargin, left: horizontalMargin, right: 20, top: verticalMargin }}
			>
				<CartesianGrid stroke="#2c2c2c" strokeDasharray="3 3" strokeOpacity={0.5} vertical={false} />

				<XAxis
					axisLine={{ stroke: "#666" }}
					dataKey="formattedDate"
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
				/>
				<Tooltip content={CustomTooltip} cursor={{ fill: "rgba(255, 255, 255, 0.1)" }} />
				<Bar dataKey="updateCount" fill="#0072f5" radius={[2, 2, 0, 0]} />
			</BarChart>
		</ResponsiveContainer>
	);
}

function CustomTooltip({ active, payload }: TooltipContentProps<number, string>) {
	if (active && payload && payload.length) {
		const data = payload[0]!.payload;
		return (
			<div className="rounded-md border border-[#555] bg-[#333] p-2">
				<p className="text-[#fff]">
					<span className="text-white">Date:</span> <time>{data.date}</time>
				</p>
				<p className="text-[#fff]">
					<span className="text-white">Message count:</span> {data.updateCount}
				</p>
			</div>
		);
	}
	return null;
}

interface BarsProps {
	events?: boolean;
	data: GetMyMonthlyProgressResponse;
}

export type GetMyMonthlyProgressResponse = {
	date: `${number}-${number}-${number}`;
	value: number;
	updateCount: number;
}[];
