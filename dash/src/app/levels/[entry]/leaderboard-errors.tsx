import Link from "next/link";
import { SignInButton } from "@/components/SignIn.tsx";

export function NotViewable({ statusCode, description }: LeaderboardErrorProps) {
	return (
		<div className="mt-16 flex flex-col items-center gap-12">
			<h1 className="font-bold text-9xl tracking-widest">{statusCode}</h1>
			<p className="flex flex-col items-center gap-2 text-center">
				{description}
				<Link className="w-fit rounded-lg bg-blurple px-2 py-1.5 transition-colors hover:bg-blurple/75" href="/levels">
					Take me back
				</Link>
			</p>
		</div>
	);
}

export function MustLogIn({ statusCode, description }: LeaderboardErrorProps) {
	return (
		<div className="mt-16 flex flex-col items-center gap-12">
			<h1 className="font-bold text-9xl tracking-widest">{statusCode}</h1>
			<p className="flex flex-col items-center gap-2 text-center">
				{description}
				<SignInButton />
			</p>
		</div>
	);
}

interface LeaderboardErrorProps {
	readonly statusCode: number;
	readonly description: string;
}
