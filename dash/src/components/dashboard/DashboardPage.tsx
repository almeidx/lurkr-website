import type { PropsWithChildren } from "react";

export function DashboardPage({ children, description, title }: DashboardPageProps) {
	return (
		<div className="flex w-full flex-col gap-5 p-4">
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold">{title}</h2>
				{description && <p className="text-white/75">{description}</p>}
			</div>

			{children}
		</div>
	);
}

type DashboardPageProps = PropsWithChildren<{
	readonly description?: string;
	readonly title: string;
}>;
