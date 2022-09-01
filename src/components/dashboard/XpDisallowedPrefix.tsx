import { MdClear } from "react-icons/md";

export type XpDisallowedPrefixOnDeleteFn = (index: number) => unknown;

interface XpDisallowedPrefixProps {
	index: number;
	onDelete: XpDisallowedPrefixOnDeleteFn;
	prefix: string;
}

export default function XpDisallowedPrefix({ index, prefix, onDelete }: XpDisallowedPrefixProps) {
	return (
		<div className="relative flex flex-row flex-wrap justify-between gap-y-2 rounded-lg bg-discord-dark p-2">
			<label
				className="mr-2 flex shrink-0 items-center justify-center rounded-full bg-discord-not-quite-black px-4 text-white shadow-lg"
				htmlFor={`${index}-disallowed-prefix`}
			>
				{prefix}
			</label>
			<MdClear onClick={() => onDelete(index)} className="ml-auto h-12 w-8 cursor-pointer py-3 text-red-500" />
		</div>
	);
}
