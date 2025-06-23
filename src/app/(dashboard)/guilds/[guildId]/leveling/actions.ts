"use server";

import { cookies } from "next/headers";
import { parse } from "valibot";
import { TOKEN_COOKIE } from "@/utils/constants.ts";
import { makeApiRequest } from "@/utils/make-api-request.ts";
import { vanitySchema } from "@/utils/schemas.ts";

export async function checkVanityAvailability(vanityInput: string): Promise<VanityAvailabilityResponse> {
	const vanity = parse(vanitySchema, vanityInput);

	const token = (await cookies()).get(TOKEN_COOKIE)?.value;
	if (!token) {
		throw new Error("Unauthorized");
	}

	const query = new URLSearchParams({ vanity });
	const response = await makeApiRequest(`/vanity/check?${query.toString()}`, token, {
		next: {
			revalidate: 30,
		},
	});

	if (!response.ok) {
		return { available: false };
	}

	return response.json();
}

interface VanityAvailabilityResponse {
	available: boolean;
}
