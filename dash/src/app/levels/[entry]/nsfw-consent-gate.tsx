"use client";

import { Button, Surface } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import Cookies from "js-cookie";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { NSFW_CONSENT_ACK, NSFW_CONSENT_COOKIE, NSFW_CONSENT_DAYS } from "@/utils/constants.ts";

export function NsfwConsentGate({ guildName }: NsfwConsentGateProps) {
	const router = useRouter();

	function confirmAdult() {
		Cookies.set(NSFW_CONSENT_COOKIE, NSFW_CONSENT_ACK, {
			expires: NSFW_CONSENT_DAYS,
			sameSite: "strict",
			secure: true,
		});

		router.refresh();
	}

	return (
		<div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
			<Surface className="w-full max-w-xl rounded-xl p-6 text-center">
				<h1 className="font-bold text-2xl text-white">Age-restricted leaderboard</h1>

				<p className="mt-3">
					{guildName} is flagged as an age-restricted (NSFW) server by Discord. You must be 18 or older to view its
					leaderboard.
				</p>

				<div className="mt-6 flex flex-wrap justify-center gap-3">
					<Button onPress={confirmAdult} variant="primary">
						I'm 18 or older
					</Button>

					<NextLink className={buttonVariants({ variant: "secondary" })} href="/levels">
						Back to leaderboards
					</NextLink>
				</div>
			</Surface>
		</div>
	);
}

interface NsfwConsentGateProps {
	readonly guildName: string;
}
