import type { ReactNode } from "react";

export default function Fieldset({ children, ...props }: FieldsetProps): JSX.Element {
	return (
		<fieldset className="flex w-full flex-col gap-6 rounded-xl bg-discord-slightly-darker py-7 px-4" {...props}>
			{children}
		</fieldset>
	);
}

interface FieldsetProps {
	children: ReactNode;
}
