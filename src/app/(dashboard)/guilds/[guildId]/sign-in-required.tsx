import { SignInButton } from "@/components/SignIn.tsx";

export function SignInRequired() {
	return (
		<div className="mt-6 flex flex-col items-center gap-2 text-center text-white/75 text-xl tracking-tight">
			You need to be signed in to view this page.
			<SignInButton />
		</div>
	);
}
