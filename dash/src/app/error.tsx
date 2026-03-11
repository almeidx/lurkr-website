"use client";

import { ErrorState } from "@/components/error-state.tsx";

export default function ErrorComponent({ error }: { readonly error: Error }) {
	console.error(error);

	return <ErrorState description="Something went wrong. Please try again later." statusCode={500} title="Error" />;
}
