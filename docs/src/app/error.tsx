"use client";

export default function ErrorComponent({ error }: { readonly error: Error }) {
	console.error(error);

	return (
		<div className="mt-16 flex flex-col items-center gap-12">
			<h1 className="font-bold text-9xl tracking-widest">500</h1>
			<p>An error occurred.</p>
		</div>
	);
}
