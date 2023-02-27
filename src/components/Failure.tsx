import Link from "next/link";
import { API_BASE_URL } from "~/utils/constants";

export default function Failure({ href, message, withSignIn }: FailureProps) {
	return (
		<div className="flex min-h-screen-no-footer flex-col items-center justify-center gap-5 bg-discord-dark">
			<p className="text-center text-xl font-bold text-white sm:text-3xl">{message}</p>

			{withSignIn ? (
				<div className="flex gap-3">
					<button
						className="rounded-lg bg-blurple px-4 py-2 text-white shadow-md transition-colors duration-100 hover:bg-[#414AB9]"
						onClick={(event) => {
							event.preventDefault();
							window.open(`${API_BASE_URL}/auth`, "_self");
						}}
						type="button"
					>
						Sign in
					</button>

					<Link
						className="rounded-lg bg-gray-600 px-4 py-2 text-white shadow-md transition-colors duration-100 hover:bg-gray-700"
						// @ts-expect-error: TODO
						href={href}
					>
						Go back
					</Link>
				</div>
			) : (
				<Link
					className="rounded-lg bg-gray-600 px-4 py-2 text-white shadow-md transition-colors duration-100 hover:bg-gray-700"
					// @ts-expect-error: TODO
					href={href}
				>
					Go back
				</Link>
			)}
		</div>
	);
}

interface FailureProps {
	href: string;
	message: string;
	withSignIn?: boolean;
}
