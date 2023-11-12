import { SIGN_IN_URL } from "@/utils/constants.ts";
import { FaDiscord } from "@react-icons/all-files/fa/FaDiscord";

export function SignInButton() {
	return (
		<a
			className="flex flex-nowrap items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blurple px-2 py-1"
			href={SIGN_IN_URL}
		>
			<FaDiscord size={20} />
			Log in
		</a>
	);
}
