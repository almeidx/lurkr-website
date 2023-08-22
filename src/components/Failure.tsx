import Link from "next/link";
import { API_BASE_URL } from "~/utils/constants";

export default function Failure({ href, message, withSignIn }: FailureProps) {
	return (
		<div className="flex min-h-screen-no-nav flex-col items-center justify-center gap-5 bg-discord-dark">
			<p className="text-center text-xl font-bold text-white sm:text-3xl">{message}</p>

			{withSignIn ? (
				<div className="flex gap-3">
					<button
						className="rounded-lg bg-blurple px-4 py-2 text-white shadow-md transition-colors hover:bg-[#414AB9]"
						onClick={() => void window.open(`${API_BASE_URL}/auth`, "_self")}
						type="button"
					>
						Sign in
					</button>

					<Link
						className="rounded-lg bg-gray-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-gray-700"
						href={href}
					>
						Go back
					</Link>
				</div>
			) : (
				<Link
					className="rounded-lg bg-gray-600 px-4 py-2 text-white shadow-md transition-colors hover:bg-gray-700"
					href={href}
				>
					Go back
				</Link>
			)}
		</div>
	);
}

interface FailureProps {
	readonly href: string;
	readonly message: string;
	readonly withSignIn?: boolean;
}
