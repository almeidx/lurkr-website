import { Surface } from "@heroui/react";
import type { PropsWithChildren } from "react";

export function ErrorState({ statusCode, title, description, children }: ErrorStateProps) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center px-4">
			<Surface className="rounded-2xl px-8 py-12 text-center">
				<div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-white/5">
					<span className="font-extrabold text-4xl text-white/80">{statusCode}</span>
				</div>

				<h2 className="mb-3 font-semibold text-2xl text-white">{title}</h2>
				<p className="mx-auto mb-8 max-w-sm text-white/60">{description}</p>

				{children}
			</Surface>
		</div>
	);
}

type ErrorStateProps = PropsWithChildren<{
	readonly statusCode: number;
	readonly title: string;
	readonly description: string;
}>;
