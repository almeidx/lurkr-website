import { buttonVariants } from "@heroui/styles";
import Link from "next/link";
import { ErrorState } from "@/components/error-state.tsx";

export function UnknownGuildOrMissingAccess() {
	return (
		<ErrorState
			description="This server does not exist, or you do not have access to configure it."
			statusCode={404}
			title="Server not found"
		>
			<Link className={buttonVariants({ variant: "primary" })} href="/guilds" prefetch={false}>
				Back to servers
			</Link>
		</ErrorState>
	);
}
