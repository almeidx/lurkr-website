import { BsFillQuestionCircleFill } from "react-icons/bs";

export default function Label({ htmlFor, name, url, withMargin = true }: LabelProps) {
	return (
		<label
			className={`${
				withMargin ? "mb-1" : ""
			} flex w-min max-w-xs items-center gap-2 text-center text-lg text-gray-300 lg:max-w-fit`}
			htmlFor={htmlFor}
		>
			{name}
			<a href={url} rel="noreferrer" target="_blank">
				<BsFillQuestionCircleFill className="h-4 w-4 cursor-pointer fill-current text-gray-200 hover:text-gray-400" />
			</a>
		</label>
	);
}

interface LabelProps {
	htmlFor: string;
	name: string;
	url: string;
	withMargin?: boolean;
}
