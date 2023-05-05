import type { Metadata } from "next";
import Error from "~/components/Error";

export default function NotFound() {
	return <Error code={404} message="This page could not be found." />;
}

export const metadata: Metadata = {
	title: "Not Found | Lurkr",
};
