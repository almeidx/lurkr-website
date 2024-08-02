"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export function SaveButton({ pending, success }: SaveButtonProps) {
	const [showSuccessStatus, setShowSuccessStatus] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout>(null);

	useEffect(() => {
		if (success !== null) {
			setShowSuccessStatus(true);

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				timeoutRef.current = null;
				setShowSuccessStatus(false);
			}, 3_000);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [success]);

	return (
		<button
			type="submit"
			className={clsx(
				"w-40 rounded-lg px-4 py-2 text-xl",
				pending
					? "animate-pulse cursor-not-allowed bg-light-gray"
					: success === false && showSuccessStatus
						? "bg-red"
						: "bg-green",
			)}
			disabled={pending}
		>
			{pending ? "Saving…" : success === null || !showSuccessStatus ? "Save settings" : success ? "Saved!" : "Failed"}
		</button>
	);
}

interface SaveButtonProps {
	readonly pending: boolean;
	readonly success: boolean | null;
}
