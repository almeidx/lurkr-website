import { Navbar } from "@/components/Navbar.tsx";
import { getUserSafe } from "@/lib/auth.ts";

export function NavbarContainer() {
	const user = getUserSafe();

	return <Navbar user={user} />;
}
