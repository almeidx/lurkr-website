"use client";

import { MdOutlineLockReset } from "@react-icons/all-files/md/MdOutlineLockReset";

export function ResetAll() {
	function handleResetAllRequest() {
		globalThis.alert("Coming soon!");
	}

	return (
		<button
			className="flex w-fit items-center gap-2 rounded-lg bg-red px-2 py-1 text-lg font-semibold text-shadow-regular md:text-xl"
			onClick={handleResetAllRequest}
			type="button"
		>
			Reset All
			<MdOutlineLockReset className="drop-shadow-regular" />
		</button>
	);
}
