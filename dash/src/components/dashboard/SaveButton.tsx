import clsx from "clsx";

export function SaveButton({ pending, success }: SaveButtonProps) {
	return (
		<button
			className={clsx(
				"w-40 rounded-lg px-4 py-2 text-xl",
				pending ? "animate-pulse bg-light-gray" : success === false ? "bg-red" : "bg-green",
			)}
			disabled={pending}
			type="submit"
		>
			{pending ? "Saving…" : success === null ? "Save settings" : success ? "Saved!" : "Failed"}
		</button>
	);
}

interface SaveButtonProps {
	readonly pending: boolean;
	readonly success: boolean | null;
}
