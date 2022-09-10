/* eslint-disable promise/prefer-await-to-callbacks, promise/prefer-await-to-then */

import Cookie from "js-cookie";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { type Snowflake, API_BASE_URL } from "../utils/constants";

interface UserContextData {
	accessToken: string;
	authenticated: boolean;
	avatar: string;
	discriminator: string;
	id: Snowflake;
	username: string;
}

interface UserContextProps {
	children: ReactNode;
}

interface AuthSuccessResponse {
	cookies: {
		"connect.sid": string;
	};
	message: string;
	success: true;
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
					const data = (await res.json()) as AuthSuccessResponse;
					if (res.status === 200) {
						setUserData({
							authenticated: true,
							...data.user,
						});
						Cookie.set("connect.sid", data.cookies["connect.sid"]);
					} else {
						console.error("Failed to authenticate", res);
						throw new Error("Failed to authenticate user");
					}
				})
				.catch((error) => console.error("Failed to authenticate", error));
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
