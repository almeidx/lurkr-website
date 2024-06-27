"use client";

import clsx from "clsx";
import { useFormStatus } from "react-dom";

export function SaveButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			className={clsx("w-40 rounded-lg px-4 py-2 text-xl", pending ? "animate-pulse bg-light-gray" : "bg-green")}
			disabled={pending}
		>
			{pending ? "Saving…" : "Save Settings"}
		</button>
	);
}
