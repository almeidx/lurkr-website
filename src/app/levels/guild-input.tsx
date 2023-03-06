"use client";

import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import Input from "~/components/form/Input";
import { isValidSnowflake } from "~/utils/common";

export function GuildInput() {
	const [serverIdOrVanity, setServerIdOrVanity] = useState<string>("");
	const submitRef = useRef<HTMLButtonElement>(null);
	const router = useRouter();

	useEffect(() => {
		window.scroll({ behavior: "auto", left: 0, top: 0 });
	}, []);

	let timeout: NodeJS.Timeout | null = null;

	const handleServerIdSubmit = () => {
		if (isValidSnowflake(serverIdOrVanity) || isValidVanity(serverIdOrVanity)) {
			void router.push(`/levels/${serverIdOrVanity}`);
		} else {
			if (submitRef.current) {
				submitRef.current.style.color = "#ed4245";
			}

			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(() => {
				if (submitRef.current) {
					submitRef.current.style.color = "#fff";
				}
			}, 1_000);
		}
	};

	return (
		<Input
			className="my-5"
			id="searchTerm"
			initialValue=""
			maxLength={32}
			onChange={(text) =>
				text
					? /(?:^[1-9]\d{17,19}$)|(?:^[\da-z]+$)/i.test(text) && setServerIdOrVanity(text)
					: setServerIdOrVanity(text)
			}
			onSubmit={handleServerIdSubmit}
			placeholder="Enter a server ID/vanity"
			submitRef={submitRef}
		/>
	);
}

function isValidVanity(str: string) {
	return /^[\da-z]{2,32}$/i.test(str);
}
