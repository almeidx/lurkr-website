import { ProfileButton } from "@/components/navigation/profile.tsx";
import { SignInButton } from "@/components/navigation/sign-in.tsx";
import { getCurrentUser } from "@/lib/auth.ts";

export async function NavbarUserButton() {
	const user = await getCurrentUser();

	return user ? <ProfileButton {...user} /> : <SignInButton />;
}
