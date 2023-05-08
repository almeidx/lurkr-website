"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Input from "@/form/Input";
import { isValidSnowflake } from "~/utils/common";
import { MAX_VANITY_LENGTH } from "~/utils/guild-config";

export default function LeaderboardGuildIdInput() {
	const [serverIdOrVanity, setServerIdOrVanity] = useState<string>("");
	const submitRef = useRef<HTMLButtonElement>(null);
	const router = useRouter();

	useEffect(() => {
		window.scroll({ behavior: "auto", left: 0, top: 0 });
	}, []);

	let timeout: NodeJS.Timeout | null = null;

	const handleServerIdSubmit = () => {
		if (isValidSnowflake(serverIdOrVanity) || isValidVanity(serverIdOrVanity)) {
			router.push(`/levels/${serverIdOrVanity}`);
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
			buttonType="submit"
			className="my-5"
			id="searchTerm"
			initialValue=""
			maxLength={MAX_VANITY_LENGTH}
			onChange={(text) =>
				text
					? /(?:^[1-9]\d{17,19}$)|(?:^[\da-z]+$)/i.test(text) && setServerIdOrVanity(text)
					: setServerIdOrVanity(text)
			}
			onSubmit={handleServerIdSubmit}
			placeholder="Enter a server ID or vanity"
			submitRef={submitRef}
		/>
	);
}

function isValidVanity(str: string) {
	return /^[\da-z]{2,32}$/i.test(str);
}
