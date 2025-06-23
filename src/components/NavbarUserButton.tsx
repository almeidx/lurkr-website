import { cookies } from "next/headers";
import { ProfileButton } from "@/components/Profile.tsx";
import { SignInButton } from "@/components/SignIn.tsx";
import { getCurrentUser } from "@/lib/auth.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";

export async function NavbarUserButton() {
	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	const user = token ? await getCurrentUser(token) : null;

	return user ? <ProfileButton {...user} /> : <SignInButton />;
}
