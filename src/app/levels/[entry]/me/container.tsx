"use client";

import { MessageCounts } from "@/app/levels/[entry]/me/message-counts.tsx";
import { ParentSize } from "@visx/responsive";

export function GraphContainer({ data }: { data: any }) {
	return (
		<ParentSize debounceTime={10}>
			{({ width, height }) => <MessageCounts width={width} height={height} data={data} />}
		</ParentSize>
	);
}
