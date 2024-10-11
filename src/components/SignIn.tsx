import { Discord } from "@/components/icons/Discord.tsx";
import { SIGN_IN_URL } from "@/utils/constants.ts";

export function SignInButton() {
	return (
		<a
			className="flex w-fit flex-nowrap items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blurple px-2 py-1"
			href={SIGN_IN_URL}
		>
			<Discord className="size-5" />
			Log in
		</a>
	);
}
