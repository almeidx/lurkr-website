import { ArrowRightToSquare } from "@gravity-ui/icons";
import { buttonVariants } from "@heroui/styles";
import clsx from "clsx";
import { SIGN_IN_URL } from "@/utils/constants.ts";

export function SignInButton() {
	return (
		<a className={clsx(buttonVariants({ variant: "primary" }), "w-full md:w-auto")} href={SIGN_IN_URL}>
			<ArrowRightToSquare className="size-4" />
			Log in
		</a>
	);
}
