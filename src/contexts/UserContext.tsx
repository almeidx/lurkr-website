"use client";

import Cookie from "js-cookie";
import { createContext, useEffect, useState, type ReactNode, useMemo } from "react";
import { type Snowflake, API_BASE_URL } from "~/utils/constants";

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
	});

	useEffect(() => {
		if (userData.authenticated) return;

		fetch(`${API_BASE_URL}/auth/success`, {
			credentials: "include",
			headers: {
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Origin": API_BASE_URL,
				"Content-Type": "application/json",
			},
		})
			.then(async (res) => {
				if (!res.ok) return;

				const data = (await res.json()) as AuthSuccessResponse;
				setUserData({ ...data.user, authenticated: true });
				Cookie.set("connect.sid", data.cookie);
			})
			.catch(() => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const value = useMemo(() => userData, [userData]);

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export interface UserGuild {
	icon: string | null;
	id: Snowflake;
	name: string;
}
