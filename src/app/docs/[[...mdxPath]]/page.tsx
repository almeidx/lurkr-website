import { useMDXComponents } from "@/mdx-components.tsx";
import { generateStaticParamsFor, importPage } from "nextra/pages";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

export async function generateMetadata(props: any) {
	const params = await props.params;
	const { metadata } = await importPage(params.mdxPath);
	return metadata;
}

// biome-ignore lint/correctness/useHookAtTopLevel: Not a react hook
const Wrapper = useMDXComponents().wrapper!;

export default async function Page(props: any) {
	const params = await props.params;
	const result = await importPage(params.mdxPath);
	const { default: MDXContent, toc, metadata } = result;
	return (
		<Wrapper toc={toc} metadata={metadata}>
			<MDXContent {...props} params={params} />
		</Wrapper>
	);
}
