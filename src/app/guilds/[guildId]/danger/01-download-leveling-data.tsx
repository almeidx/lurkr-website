"use client";

import { MdFileDownload } from "@react-icons/all-files/md/MdFileDownload";

export function DownloadLevelingData() {
	function handleDownloadRequest() {
		globalThis.alert("Coming soon!");
	}

	return (
		<button
			className="flex w-fit items-center gap-2 rounded-lg bg-light-gray px-2 py-1 text-lg font-semibold text-shadow-regular md:text-xl"
			onClick={handleDownloadRequest}
			type="button"
		>
			Download
			<MdFileDownload className="drop-shadow-regular" />
		</button>
	);
}
