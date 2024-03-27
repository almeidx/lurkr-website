import { ExternalLink } from "@/components/ExternalLink.tsx";
import { RiQuestionFill } from "@react-icons/all-files/ri/RiQuestionFill";

export function DocsBubble({ path }: { readonly path: string }) {
	if (!path.startsWith("/")) {
		throw new Error("The path must start with a slash");
	}

	return (
		<ExternalLink href={`https://docs.lurkr.gg${path}`}>
			<span className="sr-only">Open documentation in a new tab</span>
			<RiQuestionFill className="ml-2 fill-icon-gradient-tertiary" size={14} />
		</ExternalLink>
	);
}
