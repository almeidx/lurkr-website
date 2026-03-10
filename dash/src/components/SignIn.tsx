import { ArrowRightToSquare } from "@gravity-ui/icons";
import { SIGN_IN_URL } from "@/utils/constants.ts";

export function SignInButton() {
	return (
		<a className="button button--primary w-full md:w-auto" href={SIGN_IN_URL}>
			<ArrowRightToSquare className="size-5" />
			Log in
		</a>
	);
}
