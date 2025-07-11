"use client";

import { type ChangeEvent, useRef, useState } from "react";
import { checkVanityAvailability } from "@/app/(dashboard)/guilds/[guildId]/leveling/actions.ts";
import { Input } from "@/components/dashboard/Input.tsx";
import { Check } from "@/components/icons/mdi/check.tsx";
import { Close } from "@/components/icons/mdi/close.tsx";
import { MAX_VANITY_LENGTH, MIN_VANITY_LENGTH, VANITY_REGEX_SOURCE } from "@/lib/guild-config.ts";

export function LeaderboardVanity({ defaultValue }: { defaultValue: string | null }) {
	const [vanity, setVanity] = useState(defaultValue ?? "");
	const [available, setAvailable] = useState<boolean | null>(null);
	const timeoutId = useRef<NodeJS.Timeout | null>(null);

	const vanityRegex = new RegExp(VANITY_REGEX_SOURCE);

	async function verifyAvailability(value: string) {
		const { available } = await checkVanityAvailability(value);
		setAvailable(available);
	}

	async function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value.toLowerCase();
		setVanity(value);

		if (timeoutId.current) {
			clearTimeout(timeoutId.current);
		}

		setAvailable(null);

		if (value.length < MIN_VANITY_LENGTH || value.length > MAX_VANITY_LENGTH || !vanityRegex.test(value)) {
			return;
		}

		timeoutId.current = setTimeout(() => {
			verifyAvailability(value);
		}, 500);
	}

	return (
		<div className="flex flex-col gap-4 xl:flex-row xl:items-center">
			<Input
				className="w-full max-w-96"
				id="vanity"
				maxLength={MAX_VANITY_LENGTH}
				minLength={MIN_VANITY_LENGTH}
				onChange={handleChange}
				pattern={VANITY_REGEX_SOURCE}
				placeholder="Enter a vanity URL…"
				value={vanity}
			/>

			{available ? (
				<Check className="text-green" />
			) : available === false ? (
				<div className="text-red">
					<Close />
					<p>This vanity URL is already taken.</p>
				</div>
			) : null}
		</div>
	);
}
