import { ProfileButton } from "@/components/Profile.tsx";
import { SignInButton } from "@/components/SignIn.tsx";
import type { User } from "@/lib/auth.ts";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { cookies } from "next/headers";

export async function NavbarUserButton() {
	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	const user = token ? await getUser(token) : null;

	return user ? <ProfileButton {...user} /> : <SignInButton />;
}

async function getUser(token: string) {
	const response = await makeApiRequest("/users/@me", token, {
		next: {
			revalidate: 60 * 60, // 1 hour
			tags: ["user"],
		},
	});

	if (!response.ok) {
		return null;
	}

	return (await response.json()) as User;
}
