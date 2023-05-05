import type { PropsWithChildren } from "react";
import UserProvider from "~/contexts/UserContext";

export function Providers({ children }: PropsWithChildren) {
	return <UserProvider>{children}</UserProvider>;
}
