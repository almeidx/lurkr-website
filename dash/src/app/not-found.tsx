import "@/app/globals.css";

import { buttonVariants } from "@heroui/styles";
import type { Metadata } from "next";
import Link from "next/link";
import { ErrorState } from "@/components/error-state.tsx";

export const metadata: Metadata = {
	description: "The page you're looking for could not be found.",
	title: "Page Not Found",
};

export default function NotFound() {
	return (
		<ErrorState description="The page you're looking for doesn't exist." statusCode={404} title="Page not found">
			<Link className={buttonVariants({ variant: "primary" })} href="/">
				Back to home
			</Link>
		</ErrorState>
	);
}
