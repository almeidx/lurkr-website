"use client";

import { Text } from "@/components/dashboard/Text.tsx";

export default function ErrorComponent({ error }: { readonly error: Error }) {
	console.error(error);

	return (
		<div className="mt-16 flex flex-col items-center gap-12">
			<h1 className="font-bold text-9xl tracking-widest">500</h1>
			<Text>An error occurred.</Text>
		</div>
	);
}
