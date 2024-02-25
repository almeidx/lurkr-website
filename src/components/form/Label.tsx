import { BsFillQuestionCircleFill } from "react-icons/bs";

export default function Label({ htmlFor, name, url, withMargin = true }: LabelProps) {
	return (
		<label
			className={`${
				withMargin ? "mb-1" : ""
			} flex w-min max-w-xs items-center gap-2 text-center text-lg text-gray-300 md:whitespace-nowrap lg:max-w-fit`}
			htmlFor={htmlFor}
		>
			{name}
			<a href={url} target="_blank" rel="external noopener noreferrer">
				<BsFillQuestionCircleFill className="size-4 cursor-pointer fill-current text-gray-200 hover:text-gray-400" />
			</a>
		</label>
	);
}

interface LabelProps {
	readonly htmlFor: string;
	readonly name: string;
	readonly url: string;
	readonly withMargin?: boolean;
}
