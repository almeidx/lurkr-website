import { unstable_rethrow } from "next/navigation";
import { ProfileButton } from "@/components/navigation/profile.tsx";
import { SignInButton } from "@/components/navigation/sign-in.tsx";
import { getCurrentUser } from "@/lib/auth.ts";

export async function NavbarUserButton() {
	const user = await getNavbarUser();

	return user ? <ProfileButton {...user} /> : <SignInButton />;
}

// The root layout renders the navbar on every page, where only global-error.tsx could catch a failure and would
// replace the whole site with it. An API failure falls back to the signed-out button instead.
async function getNavbarUser() {
	try {
		return await getCurrentUser();
	} catch (error) {
		unstable_rethrow(error);
		console.error("Failed to fetch the current user", error);
		return null;
	}
}
