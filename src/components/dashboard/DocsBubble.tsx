import { RiQuestionFill } from "@react-icons/all-files/ri/RiQuestionFill";

export function DocsBubble({ path }: { readonly path: string }) {
	if (!path.startsWith("/")) {
		throw new Error("The path must start with a slash");
	}

	return (
		<a
			aria-label="Documentation"
			href={`https://docs.lurkr.gg${path}`}
			rel="external noopener noreferrer"
			target="_blank"
		>
			<RiQuestionFill className="ml-2 fill-icon-gradient-tertiary" size={14} />
		</a>
	);
}
