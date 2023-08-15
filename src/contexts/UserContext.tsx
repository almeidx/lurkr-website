import Cookie from "js-cookie";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { type Snowflake, API_BASE_URL } from "~/utils/constants";

export interface UserContextData {
	accessToken: string;
	authenticated: boolean;
	avatar: string;
	discriminator: string;
	globalName: string | null;
	id: Snowflake;
	locale: string;
	refreshToken: string;
	username: string;
}

interface UserContextProps {
	children: ReactNode;
}

interface AuthSuccessResponse {
	cookie: string;
	user: Omit<UserContextData, "authenticated">;
}

export const UserContext = createContext({} as UserContextData);

export default function UserProvider({ children }: UserContextProps) {
	const [userData, setUserData] = useState<UserContextData>({
		accessToken: "",
		authenticated: false,
		avatar: "",
		discriminator: "",
		id: "" as Snowflake,
		username: "",
		globalName: null,
		locale: "",
		refreshToken: "",
	});

	useEffect(() => {
		if (!userData.authenticated) {
			fetch(`${API_BASE_URL}/auth/success`, {
				credentials: "include",
				headers: {
					"Access-Control-Allow-Credentials": "true",
					"Access-Control-Allow-Origin": API_BASE_URL,
					"Content-Type": "application/json",
				},
			})
				.then(async (res) => {
					if (res.ok) {
						const data = (await res.json()) as AuthSuccessResponse;
						setUserData({ ...data.user, authenticated: true });
						Cookie.set("connect.sid", data.cookie);
					}
				})
				.catch(() => {});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
}

export interface UserGuild {
	icon: string | null;
	id: Snowflake;
	name: string;
}
