import { ProfileButton } from "@/components/Profile.tsx";
import { SignInButton } from "@/components/SignIn.tsx";
import { getCurrentUser } from "@/lib/auth.ts";

export async function NavbarUserButton() {
	const user = await getCurrentUser();

	return user ? <ProfileButton {...user} /> : <SignInButton />;
}
