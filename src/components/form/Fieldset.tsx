import type { ReactNode } from "react";

export default function Fieldset({ children, ...props }: FieldsetProps): JSX.Element {
	return (
		<fieldset className="bg-discord-slightly-darker flex w-full flex-col gap-6 rounded-xl px-4 py-7" {...props}>
			{children}
		</fieldset>
	);
}

interface FieldsetProps {
	children: ReactNode;
}
