import { buttonVariants } from "@heroui/styles";
import type { Metadata } from "next";
import Link from "next/link";
import { ErrorState } from "@/components/error-state.tsx";

const description = "This server does not exist or does not have the leveling system enabled.";

export const metadata: Metadata = {
	description,
	title: "Leaderboard Not Found",
};

export default function LeaderboardNotFound() {
	return (
		<ErrorState description={description} statusCode={404} title="Leaderboard not found">
			<Link className={buttonVariants({ variant: "primary" })} href="/levels">
				Back to leaderboards
			</Link>
		</ErrorState>
	);
}
